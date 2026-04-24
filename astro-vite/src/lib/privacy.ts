// Honest browser-speech-privacy detection.
// Safari runs Web Speech on-device. Chrome/Edge stream audio to Google.
export type SpeechPrivacyMode = 'on-device' | 'cloud' | 'unknown';

export function getSpeechPrivacyMode(): SpeechPrivacyMode {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua);
  return isSafari ? 'on-device' : 'cloud';
}