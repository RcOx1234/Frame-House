/** Contacto centralizado — usar en toda la web */
export const FRAMEHOUSE_WHATSAPP_E164 = '593991433792';
export const FRAMEHOUSE_WHATSAPP_DISPLAY = '099 143 3792';
export const FRAMEHOUSE_WHATSAPP_INTERNATIONAL = '+593 99 143 3792';
export const FRAMEHOUSE_EMAIL = 'framehouselatam@gmail.com';

export function buildWhatsAppUrl(message: string): string {
  const base = `https://wa.me/${FRAMEHOUSE_WHATSAPP_E164}?text=`;
  let msg = message;
  const maxUrlLength = 7500;
  let url = base + encodeURIComponent(msg);
  while (url.length > maxUrlLength && msg.length > 120) {
    msg = `${msg.slice(0, Math.floor(msg.length * 0.82))}…`;
    url = base + encodeURIComponent(msg);
  }
  return url;
}
