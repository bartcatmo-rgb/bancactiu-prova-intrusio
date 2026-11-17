/**
 * BancActiu 3.0 Enterprise - Central Feature Flags Manager
 * Control de funcionalitats perimetrals, passarel·les oficials i autenticació ciutadana.
 */

export const FEATURE_FLAGS = {
  IDCAT_MOVIL_ENABLED: 'bancactiu_ff_idcat_movil',
  SOCIAL_SERVICES_ENABLED: 'bancactiu_ff_social_services',
  VIA_OBERTA_ENABLED: 'bancactiu_ff_via_oberta',
} as const;

/**
 * Retorna si la integració d'idCAT Mòbil (Consorci AOC) està habilitada.
 * Per defecte: estrictament FALSE (desactivada a l'espera de conveni i certificat de segell).
 */
export function isIdCatMovilEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const local = localStorage.getItem(FEATURE_FLAGS.IDCAT_MOVIL_ENABLED);
    if (local !== null) return local === 'true';

    // Comprovació per cookie de sessió/tenant
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${FEATURE_FLAGS.IDCAT_MOVIL_ENABLED}=`));
    if (match) return match.split('=')[1] === 'true';

    return false; // Predeterminat: Inactiu
  } catch {
    return false;
  }
}

/**
 * Modifica l'estat del Feature Flag d'idCAT Mòbil (AOC) i notifica a tots els components.
 */
export function setIdCatMovilEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FEATURE_FLAGS.IDCAT_MOVIL_ENABLED, String(enabled));
    document.cookie = `${FEATURE_FLAGS.IDCAT_MOVIL_ENABLED}=${enabled}; path=/; max-age=31536000; SameSite=Lax;`;
    window.dispatchEvent(new CustomEvent('bancactiu_feature_flags_changed', { detail: { idCatMovil: enabled } }));
  } catch (err) {
    console.warn('[FEATURE-FLAGS] Error desant flag idCAT Mòbil:', err);
  }
}
