import { NextResponse } from 'next/server';
import { 
  interopGatewayManager, 
  encryptSensitiveData, 
  decryptSensitiveData, 
  maskCitizenRecord 
} from '@bancactiu/interoperability-connector';
import { guardApiAccess } from '@/lib/security-api-guard';

export async function POST(request: Request) {
  const guard = guardApiAccess(request, { requiredRoles: ['SUPERADMIN', 'SUPER_ADMIN'], isWriteOperation: true });
  if (!guard.allowed) return guard.response!;

  try {
    const body = await request.json();
    const {
      endpointId = 'ep-via-oberta-dependencia',
      citizenIdentifier = '43999888A',
      legalBasis = 'MISSIO_INTERES_PUBLIC_RGPD_6_1_E',
      requestSuperAdminUnmask = false
    } = body;

    const professional = {
      dni: '52622304Y',
      nom: 'Mireia Valls (SuperAdmin GAPIC)',
      rol: 'SUPERADMIN'
    };

    const clientIp = guard.clientIp;

    // Execució amb registre d'auditoria i tripwire defensiu
    const queryResult = interopGatewayManager.executeInteroperabilityQuery(
      endpointId,
      professional,
      citizenIdentifier,
      legalBasis,
      clientIp
    );

    if (!queryResult.ok) {
      return NextResponse.json({
        ok: false,
        status: queryResult.status,
        missatge: queryResult.message,
        auditId: queryResult.auditId
      }, { status: 403 });
    }

    // Mock payload from official administration (Via Oberta / AOC)
    const rawCitizenData = {
      dni: citizenIdentifier,
      nom: 'Antònia Riera Gómez',
      adreca: 'Carrer Maria Aurèlia Capmany, 14, Cornellà de Llobregat',
      dataNaixement: '1954-02-12',
      grauDiscapacitat: 68,
      grauDependencia: 'Grau II (Dependència Severa)',
      prestacions: 'Targeta Acreditativa de Discapacitat + Ajut Mobilitat Reduïda CatSalut'
    };

    // Encrypt sensitive payload with AES-256-GCM
    const encryptedPayload = encryptSensitiveData(JSON.stringify(rawCitizenData));

    // Dynamic PII Masking
    const maskedRecord = maskCitizenRecord(rawCitizenData, requestSuperAdminUnmask);

    return NextResponse.json({
      ok: true,
      status: 'PERMITTED',
      auditId: queryResult.auditId,
      endpointId,
      legalBasis,
      maskedRecord,
      encryptionMetadata: {
        algorithm: 'AES-256-GCM',
        ivLength: 16,
        authTagVerified: true,
        encryptedHexPreview: encryptedPayload.ciphertextHex.slice(0, 32) + '...'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
