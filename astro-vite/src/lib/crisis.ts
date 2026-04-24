// Crisis keyword scan for free-text and speech input.
// Matches explicit self-harm phrases, case-insensitive, whole-phrase only.
// Conservative list — tune with care.
export const CRISIS_PATTERNS: RegExp[] = [
  /\bkill (myself|me)\b/i,
  /\bend (my|it all) life\b/i,
  /\bsuicid(e|al)\b/i,
  /\bhurt (myself|me)\b/i,
  /\bself[- ]harm\b/i,
  /\bi (want|wanna) to die\b/i,
  /\bno reason to live\b/i,
];

export function containsCrisisLanguage(text: string | null | undefined): boolean {
  if (!text) return false;
  return CRISIS_PATTERNS.some((r) => r.test(text));
}