export interface Reserva {
  id_reserva: number;
  cip: string;
  nom_ciutada: string;
  telefon: string;
  email?: string;
  tipo_material: string;
  id_entitat_actual: string;
  estat_reserva: string;
  empleat_cap: string;
  data_venciment: string;
  data_indicacio?: string;
  data_entrega?: string;
  durada_mesos?: number;
  id_producte_assignat?: string;
  producte_descripcio?: string;
  devolucion_estado?: 'BUEN_ESTADO' | 'DESGASTE_NORMAL' | 'DETERIORO';
  devolucion_observaciones?: string;
  devolucion_fecha?: string;
  devolucion_recibido_por?: string;
  devolucion_aportacion_propuesta?: number;
  aviso_recogida_id?: string;
  aviso_solicitud_id?: string;
  aviso_vencimiento_id?: string;
  motiu_categoria?: string;
  motiu_descripcio?: string;
  motiu_origen?: 'CAP_CLINIC' | 'ENTITAT_COMUNITARI';
}

export type ReturnCondition = NonNullable<Reserva['devolucion_estado']>;

export interface ReturnInspectionInput {
  condition: ReturnCondition;
  notes: string;
}

export interface InventariItem {
  id: string;
  tipo: string;
  estado: 'Disponible' | 'Reservat' | 'Prestat' | 'En Manteniment';
  id_entitat: string;
  obs: string;
  imatge_url?: string;
}

export interface PrescripcionDTO {
  cip: string;
  nom_ciutada: string;
  telefon: string;
  email: string;
  tipo_material: string;
  id_entitat_actual: string;
  durada_mesos: number;
  empleat_cap: string;
  id_producte_assignat: string;
  data_venciment_personalitzada?: string;
  es_derivacio?: boolean;
  diagnostic_motiu?: string;
  observacions_cliniques?: string;
  motiu_categoria?: string;
  motiu_descripcio?: string;
  motiu_origen?: 'CAP_CLINIC' | 'ENTITAT_COMUNITARI';
}
