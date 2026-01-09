let recognition: SpeechRecognition | null = null;

export function startVoiceCommands(
  onNext: () => void,
  onRepeat: () => void,
  onStop: () => void,
  language: "en" | "hi" | "mr"
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported in this browser");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang =
    language === "hi"
      ? "hi-IN"
      : language === "mr"
      ? "mr-IN"
      : "en-IN";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

    console.log("🎙️ Heard:", transcript);

    if (transcript.includes("next")) onNext();
    if (transcript.includes("repeat")) onRepeat();
    if (transcript.includes("stop")) onStop();
  };

  recognition.start();
}

export function stopVoiceCommands() {
  recognition?.stop();
}
