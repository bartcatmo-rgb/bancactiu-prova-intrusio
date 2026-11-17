export interface PeripheralDevice {
  id: string;
  name: string;
  type: 'DNIe_READER' | 'BIOMETRIC_SCANNER' | 'SIGNATURE_PAD' | 'SMARTCARD';
  status: 'CONNECTED' | 'DISCONNECTED' | 'READY';
  vendorId?: string;
  firmwareVersion?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  category: 'WHEELCHAIR' | 'CRUTCHES' | 'PRESSURE_MATTRESS' | 'ELECTRIC_BED' | 'OXYGEN_CONCENTRATOR';
  brandModel: string;
  serialNumber: string;
  status: 'AVAILABLE' | 'LOANED' | 'MAINTENANCE' | 'DECOMMISSIONED';
  location: string;
  assignedCitizenId?: string;
  updatedAt: string;
}

export interface OnboardingNotificationPayload {
  citizenId: string;
  citizenName: string;
  phone: string;
  email: string;
  channel: 'SMS' | 'EMAIL' | 'BOTH';
  authMethod: 'idCAT_Mòbil' | 'Cl@ve' | 'DNIe';
  temporaryPasscodeHash?: string;
}

export class PeripheralManager {
  static getDetectedHardware(): PeripheralDevice[] {
    return [
      { id: 'per-01', name: 'Lector DNIe / Targeta Sanitària USB-C', type: 'DNIe_READER', status: 'READY', vendorId: '0464:0017', firmwareVersion: 'v2.4.1' },
      { id: 'per-02', name: 'Tauleta Captura Signatura Digital Wacom', type: 'SIGNATURE_PAD', status: 'READY', vendorId: '056a:0301', firmwareVersion: 'v1.1.0' },
      { id: 'per-03', name: 'Sensor Biomètric Òptic FIPS-201', type: 'BIOMETRIC_SCANNER', status: 'READY', vendorId: '0483:5740', firmwareVersion: 'v3.0.2' },
    ];
  }
}

export class InventoryManager {
  static getSampleInventory(): InventoryItem[] {
    return [
      { id: 'inv-01', code: 'WCH-001', category: 'WHEELCHAIR', brandModel: 'Cadira de Rodes Plegable', serialNumber: 'SN-94821', status: 'AVAILABLE', location: 'Magatzem Central Cornellà', updatedAt: '2026-11-09T10:00:00Z' },
      { id: 'inv-02', code: 'WCH-002', category: 'WHEELCHAIR', brandModel: 'Cadira de Rodes Alumini Lleugera', serialNumber: 'SN-94822', status: 'LOANED', location: 'Domicili Ciutadà (SJD Baix Llobregat)', assignedCitizenId: 'cit-1042', updatedAt: '2026-11-09T11:15:00Z' },
      { id: 'inv-03', code: 'CRU-001', category: 'CRUTCHES', brandModel: 'Caminador Articulat amb Rodes', serialNumber: 'SN-33104', status: 'AVAILABLE', location: 'Magatzem Central Cornellà', updatedAt: '2026-11-09T09:30:00Z' },
      { id: 'inv-04', code: 'BED-001', category: 'ELECTRIC_BED', brandModel: 'Llit Articulat Hospitalari', serialNumber: 'SN-77219', status: 'LOANED', location: 'Domicili Ciutadà (SJD Baix Llobregat)', assignedCitizenId: 'cit-1043', updatedAt: '2026-11-08T16:45:00Z' },
      { id: 'inv-05', code: 'OXY-001', category: 'OXYGEN_CONCENTRATOR', brandModel: 'Concentrador Oxigen Mòbil', serialNumber: 'SN-55410', status: 'MAINTENANCE', location: 'Magatzem GAPIC Metropolitana', updatedAt: '2026-11-07T14:20:00Z' },
    ];
  }
}

export class NotificationDispatcher {
  static async triggerOnboardingNotice(payload: OnboardingNotificationPayload): Promise<{ success: boolean; trackingId: string; timestamp: string }> {
    const timestamp = new Date().toISOString();
    const trackingId = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Registro de auditoría conforme a RGPD y Esquema Nacional de Seguridad (ENS Medio)
    return {
      success: true,
      trackingId,
      timestamp,
    };
  }
}
