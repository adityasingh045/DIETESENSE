let utterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking() {
  window.speechSynthesis.cancel();
  utterance = null;
}

export function speakStep(
  step: string,
  lang: "en" | "hi" | "mr",
  onEnd?: () => void
) {
  stopSpeaking();

  utterance = new SpeechSynthesisUtterance(step);

  utterance.lang =
    lang === "hi"
      ? "hi-IN"
      : lang === "mr"
      ? "mr-IN"
      : "en-US";

  utterance.rate = 0.95;
  utterance.pitch = 1;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
