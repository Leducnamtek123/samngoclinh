export function sanitizeHtml(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  try {
    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(html);
  } catch (e) {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
}
