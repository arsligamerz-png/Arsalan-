import { useState, useEffect, useRef, useCallback } from 'react';

// Polyfill for browser compatibility
// FIX: Cast window to `any` to access non-standard browser APIs and rename to avoid type collision.
const SpeechRecognitionApi = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    // FIX: Use the global SpeechRecognition type, which is no longer shadowed by the constant.
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!SpeechRecognitionApi) {
            console.warn("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognitionApi();
        recognition.continuous = false;
        recognition.lang = 'en-US'; // Best for mixed Roman Urdu + English
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const currentTranscript = event.results[0][0].transcript;
            setTranscript(currentTranscript);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) {
            console.warn("Speech Synthesis API not supported in this browser.");
            return;
        }
        
        // Cancel any previous speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Attempt to find a suitable voice
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.name === 'Google UK English Male');
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.includes('Male'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { isListening, transcript, startListening, stopListening, speak };
};
