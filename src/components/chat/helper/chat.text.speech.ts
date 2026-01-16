let currUtter: SpeechSynthesisUtterance | null = null;

export const speakText = (text: string, isMuted: boolean) => {
    if (!('speechSynthesis' in window)) return;

    if (isMuted && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        currUtter = null;
    }

    if (isMuted) return;

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const utter = new SpeechSynthesisUtterance(text);
    currUtter = utter;
    utter.lang = 'en-US';
    utter.rate = 1;
    utter.pitch = 1;

    utter.onend = () => {
        console.log('Ai finished talking');
        currUtter = null;
    }

    window.speechSynthesis.speak(utter);
}