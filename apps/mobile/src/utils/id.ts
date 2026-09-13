/** UUID-v4-shaped id generator for mock data — good enough for local demo state, not cryptographically strong. */
export function generateId(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const segment = (length: number) => Array.from({ length }, hex).join('');
  return `${segment(8)}-${segment(4)}-4${segment(3)}-8${segment(3)}-${segment(12)}`;
}

export function generatePin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
