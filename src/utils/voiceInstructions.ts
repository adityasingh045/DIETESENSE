let utterance: SpeechSynthesisUtterance | null = null;
let isSpeaking = false;

/* =========================
   LANGUAGE → VOICE MAP
========================= */
const LANG_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

/* =========================
   STOP SPEAKING
========================= */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    utterance = null;
  }
}

/* =========================
   SPEAK SINGLE STEP
========================= */
export function speakStep(
  text: string,
  lang: 'en' | 'hi' | 'mr' = 'en'
) {
  stopSpeaking();

  if (!('speechSynthesis' in window)) {
    alert('Voice not supported in this browser');
    return;
  }

  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_MAP[lang];
  utterance.rate = 0.95;
  utterance.pitch = 1;

  isSpeaking = true;
  window.speechSynthesis.speak(utterance);
}

/* =========================
   SPEAK ALL STEPS (AI COOKING)
========================= */
export function speakSteps(
  steps: string[],
  lang: 'en' | 'hi' | 'mr' = 'en'
) {
  stopSpeaking();

  if (!('speechSynthesis' in window)) {
    alert('Voice not supported in this browser');
    return;
  }

  let index = 0;
  isSpeaking = true;

  const speakNext = () => {
    if (!isSpeaking || index >= steps.length) {
      stopSpeaking();
      return;
    }

    utterance = new SpeechSynthesisUtterance(
      `Step ${index + 1}. ${steps[index]}`
    );
    utterance.lang = LANG_MAP[lang];
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      index++;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}
