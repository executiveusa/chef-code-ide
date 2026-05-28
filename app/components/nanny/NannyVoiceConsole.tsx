import { useState, useRef, useCallback, useEffect } from 'react';
import type { NannyBrand } from '~/lib/nanny/brand';
import { DEFAULT_BRAND } from '~/lib/nanny/brand';
import { NannyAvatar } from './NannyAvatar';

interface Props {
  brand?: NannyBrand;
  onCommand?: (text: string) => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'confirming' | 'done' | 'error';

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: { length: number; [i: number]: { isFinal: boolean; [j: number]: { transcript: string } } };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onerror: ((e: ISpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

const STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Tap to speak',
  listening: 'Listening…',
  processing: 'Processing…',
  confirming: 'Confirm command',
  done: 'Command sent',
  error: 'Error',
};

export function NannyVoiceConsole({ brand = DEFAULT_BRAND, onCommand }: Props) {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const isBrowserSupported =
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const submitTranscript = useCallback(async (text: string) => {
    if (!text.trim()) {
      setState('idle');
      return;
    }
    setState('processing');
    try {
      const res = await fetch('/api/nanny/voice/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });
      const data = (await res.json()) as {
        cleanedTranscript?: string;
        actionSuggestion?: string;
        command?: { confirmationPrompt?: string };
      };
      const reply = data.command?.confirmationPrompt ?? data.cleanedTranscript ?? data.actionSuggestion ?? text;
      setResponse(reply);
      setState('confirming');
    } catch {
      setError('Could not process your command. Please try again.');
      setState('error');
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isBrowserSupported) {
      setError('Voice input requires Chrome or Safari on iOS.');
      setState('error');
      return;
    }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setState('listening');

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let final = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          final += r[0].transcript;
        } else {
          interimText += r[0].transcript;
        }
      }
      if (final) {
        setTranscript((p) => (p + ' ' + final).trim());
      }
      setInterim(interimText);
    };

    recognition.onend = () => {
      setInterim('');
      setState((s) => {
        if (s === 'listening') {
          return 'processing';
        }
        return s;
      });
    };

    recognition.onerror = (e: ISpeechRecognitionErrorEvent) => {
      if (e.error === 'no-speech') {
        setState('idle');
      } else {
        setError(`Mic error: ${e.error}`);
        setState('error');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isBrowserSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    if (state === 'processing' && transcript) {
      void submitTranscript(transcript);
    }
  }, [state, transcript, submitTranscript]);

  const handleConfirm = () => {
    onCommand?.(transcript);
    setState('done');
    setTimeout(() => reset(), 2500);
  };

  const reset = () => {
    setState('idle');
    setTranscript('');
    setInterim('');
    setResponse('');
    setError('');
    recognitionRef.current?.abort();
  };

  const isActive = state === 'listening' || state === 'processing';

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center bg-[#FAFAF7] p-6">
      <NannyAvatar
        brand={brand}
        size="xl"
        status={state === 'listening' ? 'listening' : isActive ? 'thinking' : state === 'done' ? 'service' : 'idle'}
        className="mb-6"
      />

      <p className="mb-8 text-sm text-gray-500">{STATE_LABELS[state]}</p>

      {/* Mic button */}
      {(state === 'idle' || state === 'listening') && (
        <button
          onClick={state === 'listening' ? stopListening : startListening}
          className={`flex size-20 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
            state === 'listening' ? 'scale-110 bg-red-500 text-white' : 'text-white hover:opacity-90'
          }`}
          style={state !== 'listening' ? { backgroundColor: brand.primaryColor } : {}}
          aria-label={STATE_LABELS[state]}
        >
          {state === 'listening' ? (
            <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      )}

      {/* Processing dots */}
      {state === 'processing' && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-2 animate-bounce rounded-full"
              style={{ backgroundColor: brand.secondaryColor, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {/* Live transcript */}
      {(interim || transcript) && state !== 'idle' && (
        <div className="mt-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-3">
          <p className="mb-1 text-xs text-gray-400">Heard:</p>
          <p className="text-sm italic text-gray-800">
            &ldquo;{transcript}
            {interim && <span className="text-gray-400"> {interim}</span>}
            &rdquo;
          </p>
        </div>
      )}

      {/* Confirmation */}
      {state === 'confirming' && response && (
        <div className="mt-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-3 text-sm text-gray-800">{response}</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-lg py-2 text-sm font-medium text-white"
              style={{ backgroundColor: brand.primaryColor }}
            >
              Confirm
            </button>
            <button onClick={reset} className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 text-center">
          <p className="font-medium text-emerald-600">✓ Command sent</p>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!isBrowserSupported && state === 'idle' && (
        <p className="mt-4 text-center text-xs text-gray-400">Voice requires Chrome or Safari.</p>
      )}
    </div>
  );
}
