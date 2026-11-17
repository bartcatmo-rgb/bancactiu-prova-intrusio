export type ManagedRole =

  | 'CAP_ADMIN'

  | 'CAP_REFERENT'

  | 'ADMIN_ENTITAT'

  | 'BARRI'

  | 'ADMIN_TECNIC'

  | 'TECNIC'

  | 'DIRECCIO_GENERAL'

  | 'TECNIC_SALUT'

  | 'SUPER_ADMIN'

  | 'MEDINA'

  | 'VOLUNTARI'

  | 'REFERENT_GESTIO_CAP'

  | 'DIRECCIO_CAP'

  | 'GERENCIA_TERRITORIAL'
  | 'COORDINADOR_LOCAL'

  | 'CATSALUT'
  | 'TECNIC_SALUT_GERENCIA';



export type DemoAccessModule =

  | 'dashboard'

  | 'prescriptions'

  | 'inventory'

  | 'loans'

  | 'entities'

  | 'statistics'

  | 'users'

  | 'audit'

  | 'stations';



export type DemoPhase2Feature = 'signature_pad' | 'entity_chat' | 'document_upload';





export type TerritorialAccessLevel = 'CENTRE_LOCAL' | 'GERENCIA_TERRITORIAL'
  | 'COORDINADOR_LOCAL' | 'AUTONOMIC_MACRO';



export interface TerritorialScope {

  regio_sanitaria_id: string;

  gerencia_id: string;

  sector_id?: string;

  cap_id?: string;

  access_level: TerritorialAccessLevel;

}



export interface DemoAccount {

  id: string;

  nombre: string;

  rol: ManagedRole;

  roles: ManagedRole[];

  entitat: string;

  activo: boolean;

  email?: string;

  telefono?: string;

  accessModules?: DemoAccessModule[];

  phase2Features?: DemoPhase2Feature[];

  territorialScope?: TerritorialScope;

}



export interface DemoAuditEvent {

  id: string;

  timestamp: string;

  actorId: string;

  actorName: string;

  actorRole: string;

  action: string;

  resource: string;

  details: string;

}



export interface DemoStation {

  id: string;

  entity: string;

  name: string;

  type: 'PUESTO' | 'DISPOSITIVO';

  location: string;

  status: 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';

  deviceType: string;

  implementationPhase?: 'FASE_1' | 'FASE_2';

  ipAddress?: string;

  macAddress?: string;

  lastPing?: string;

  latencyMs?: number;

}



export interface DemoEntity {

  id: string;

  name: string;

  kind: 'CAP' | 'ENTIDAD_VECINAL' | 'ENTIDAD_COLABORADORA' | 'TECNICA';

  location: string;

  contact: string;

  phone?: string;

  active: boolean;

  capabilities?: string[];

  estatConveni?: 'PENDENT_CONVENI' | 'ACTIU_PILOT' | 'EN_PAUSA' | 'BAIXA';

  dataActivacio?: string;

  faseDesplegament?: number;

}



export interface HardwareSettings {

  signaturePadEnabled: boolean;

  documentScannerEnabled: boolean;

  rfidScannerEnabled: boolean;

  implementationPhase: 'FASE_1' | 'FASE_2' | 'FASE_3';

}



export interface CitizenDocument {

  id: string;

  reservaId?: number;

  citizenName: string;

  citizenDni: string;

  documentType: 'DNI_FRONT' | 'DNI_BACK' | 'VOLANT_MEDIC' | 'JUSTIFICANT_RESIDENCIA' | 'ALTRES';

  fileName: string;

  fileSizeKb: number;

  fileDataUrl: string;

  uploadedAt: string;

  uploadedBy: string;

  rgpdConsent: boolean;

}



export interface DemoNotification {

  id: string;

  reservationId?: number;

  entityId: string;

  citizenName: string;

  email: string;

  phone: string;

  entityPhone: string;

  kind: 'SOLICITUD' | 'RECOGIDA' | 'VENCIMIENTO' | 'CADUCIDAD' | 'INCIDENCIA' | 'DIRECTO' | 'RECORDATORIO' | 'TEXTO_LIBRE';

  channel: 'SMS' | 'EMAIL';

  scheduledAt: string;

  createdAt: string;

  status: 'PROGRAMADO' | 'PENDIENTE_PROVEEDOR' | 'ENVIADO' | 'ENTREGADO' | 'FALLIDO' | 'CANCELADO';

  message: string;

  providerMessageId?: string;

  deliveredAt?: string;

  senderName?: string;

}



export interface DemoHelpDocument {

  id: string;

  title: string;

  audience: string;

  entity: string;

  fileName: string;

  mimeType: string;

  content: string;

  updatedAt: string;

  updatedBy: string;

}



export interface DemoChatPresence {

  sessionId: string;

  userId: string;

  userName: string;

  role: ManagedRole;

  entity: string;

  lastSeenAt: string;

}



export interface DemoChatAbsence {

  userId: string;

  fromDate: string;

  untilDate: string;

  timeZone: string;

}



export interface DemoChatAcknowledgement {

  userId: string;

  messageId: string;

  acknowledgedAt: string;

}



export interface DemoChatGroup {

  id: string;

  title: string;

  memberIds: string[];

  createdBy: string;

  createdAt: string;

}



export type ChatDeliveryScope = 'ENTITY_GENERAL' | 'USER_DIRECT';



export interface DemoChatMessage {

  id: string;

  senderId: string;

  senderName: string;

  senderRole: ManagedRole;

  senderEntity: string;

  recipientUserId?: string;

  recipientUserName?: string;

  recipientEntityId?: string;

  recipientEntityName?: string;

  groupId?: string;

  scope?: ChatDeliveryScope;

  text: string;

  createdAt: string;

  isEscalated?: boolean;

  escalatedAt?: string;

  escalationReason?: string;

  acknowledgedAt?: string;

  acknowledgedBy?: string;

  acknowledgedByName?: string;

}

