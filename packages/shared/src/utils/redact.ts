const PHONE_PATTERN = /(\+?\d[\d\s-]{7,}\d)/g;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g;

/**
 * Strips phone numbers and emails from a chat message body — ARCHITECTURE.md
 * §7: "Phone numbers and emails are visible only to Ustavia's backend/CRM,
 * never to the counterparty." The real chat module runs this server-side;
 * the mobile mock store calls it client-side to demonstrate the same rule.
 */
export function redactContactInfo(body: string): { text: string; redacted: boolean } {
  let redacted = false;
  const text = body
    .replace(EMAIL_PATTERN, () => {
      redacted = true;
      return '[redacted]';
    })
    .replace(PHONE_PATTERN, () => {
      redacted = true;
      return '[redacted]';
    });

  return { text, redacted };
}
