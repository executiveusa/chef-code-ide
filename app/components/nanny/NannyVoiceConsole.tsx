import { useState } from 'react';
import type { ParsedVoiceCommand } from '~/lib/nanny/modules/voice-console';
import { NannyAvatar } from './NannyAvatar';

interface NannyVoiceConsoleProps {
  onCommand?: (command: ParsedVoiceCommand) => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'confirming' | 'dispatched';

const STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Tap to speak',
  listening: 'Listening...',
  processing: 'Processing...',
  confirming: 'Confirm command',
  dispatched: 'Command sent',
};

export function NannyVoiceConsole({ onCommand }: NannyVoiceConsoleProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [command, setCommand] = useState<ParsedVoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVoiceStart() {
    if (state !== 'idle') {
      return;
    }
    setState('listening');
    setError(null);

    // Simulate listening for 2 seconds then process
    await new Promise((r) => setTimeout(r, 2000));
    const mockText = 'create a vegan menu for 12 guests dinner party';
    setTranscript(mockText);
    setState('processing');

    try {
      const res = await fetch('/api/nanny/voice/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: mockText }),
      });
      const data = (await res.json()) as { command: ParsedVoiceCommand };
      setCommand(data.command);
      setState('confirming');
    } catch {
      setError('Could not process voice input. Try again.');
      setState('idle');
    }
  }

  function handleConfirm() {
    if (!command) {
      return;
    }
    onCommand?.(command);
    setState('dispatched');
    setTimeout(() => {
      setState('idle');
      setTranscript('');
      setCommand(null);
    }, 2000);
  }

  function handleCancel() {
    setState('idle');
    setTranscript('');
    setCommand(null);
  }

  const isActive = state === 'listening' || state === 'processing';

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center bg-[#FAFAF7] p-6">
      {/* Avatar */}
      <NannyAvatar
        size="xl"
        status={isActive ? 'thinking' : state === 'dispatched' ? 'service' : 'idle'}
        className="mb-6"
      />

      {/* State label */}
      <p className="mb-8 text-sm text-gray-500">{STATE_LABELS[state]}</p>

      {/* Big mic button */}
      {(state === 'idle' || state === 'listening') && (
        <button
          onClick={handleVoiceStart}
          disabled={state === 'listening'}
          className={`flex size-20 items-center justify-center rounded-full text-3xl shadow-lg transition-all ${
            state === 'listening'
              ? 'scale-110 bg-red-500 text-white'
              : 'bg-[#1A3A1A] text-white hover:bg-[#2a5a2a] active:scale-95'
          }`}
          aria-label={STATE_LABELS[state]}
        >
          🎙
        </button>
      )}

      {/* Processing indicator */}
      {state === 'processing' && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-2 animate-bounce rounded-full bg-[#D4A853]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {/* Transcript */}
      {transcript && state !== 'idle' && (
        <div className="mt-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-3">
          <p className="mb-1 text-xs text-gray-400">Heard:</p>
          <p className="text-sm italic text-gray-800">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}

      {/* Confirmation */}
      {state === 'confirming' && command && (
        <div className="mt-4 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-1 text-sm font-medium text-gray-800">{command.confirmationPrompt}</p>
          <p className="mb-3 text-xs text-gray-500">Confidence: {Math.round(command.confidence * 100)}%</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-lg bg-[#1A3A1A] py-2 text-sm font-medium text-white"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dispatched */}
      {state === 'dispatched' && (
        <div className="mt-4 text-center">
          <p className="font-medium text-emerald-600">✓ Command sent</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
