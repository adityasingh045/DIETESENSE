let currentStep = 0;
let timer: number | null = null;

export function startCookingSteps(
  steps: string[],
  language: "en" | "hi" | "mr",
  pauseSeconds = 6
) {
  currentStep = 0;
  speakCurrentStep(steps, language, pauseSeconds);
}

function speakCurrentStep(
  steps: string[],
  language: "en" | "hi" | "mr",
  pauseSeconds: number
) {
  if (currentStep >= steps.length) {
    speakText("Recipe completed. Enjoy your meal!", language);
    return;
  }

  const text = `Step ${currentStep + 1}. ${steps[currentStep]}`;
  speakText(text, language);

  timer = window.setTimeout(() => {
    currentStep++;
    speakCurrentStep(steps, language, pauseSeconds);
  }, pauseSeconds * 1000);
}

export function nextStep(steps: string[], language: any, pause = 6) {
  if (timer) clearTimeout(timer);
  currentStep++;
  speakCurrentStep(steps, language, pause);
}

export function repeatStep(steps: string[], language: any, pause = 6) {
  if (timer) clearTimeout(timer);
  speakCurrentStep(steps, language, pause);
}

export function stopCooking() {
  if (timer) clearTimeout(timer);
  window.speechSynthesis.cancel();
}

function speakText(text: string, language: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang =
    language === "hi"
      ? "hi-IN"
      : language === "mr"
      ? "mr-IN"
      : "en-IN";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
