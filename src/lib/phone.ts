/** Build tel: href from PH mobile display format (e.g. 0994 977 3159). */
export function phoneTel(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `tel:+63${digits.slice(1)}`;
  if (digits.startsWith('63')) return `tel:+${digits}`;
  return `tel:+${digits}`;
}