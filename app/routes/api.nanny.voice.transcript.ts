import { json, type ActionFunctionArgs } from '@vercel/remix';
import { mockTranscriptResult } from '~/lib/nanny/modules/voice-console';
import { buildMockTelemetry } from '~/lib/nanny/llm-router';
import { getEnv } from '~/lib/.server/env';

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const startMs = Date.now();
  const apiKey = getEnv('OPENAI_API_KEY');
  const contentType = request.headers.get('content-type') ?? '';

  // Text-mode fallback: JSON body with `text` field
  if (contentType.includes('application/json')) {
    let body: { text?: string; transcript?: string };
    try {
      body = (await request.json()) as { text?: string; transcript?: string };
    } catch {
      return json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const text = body.text ?? body.transcript ?? 'create a menu for 10 guests';
    const result = mockTranscriptResult(text);
    return json({
      transcript: result.transcript,
      confidence: 0.99,
      mockMode: true,
      telemetry: { ...buildMockTelemetry('voice-cleanup'), latencyMs: Date.now() - startMs },
    });
  }

  // Multipart: real audio file
  let audioBuffer: ArrayBuffer | null = null;
  let audioFilename = 'audio.webm';
  let audioMimeType = 'audio/webm';

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const audioField = formData.get('audio');
      if (audioField && audioField instanceof File) {
        audioBuffer = await audioField.arrayBuffer();
        audioFilename = audioField.name || audioFilename;
        audioMimeType = audioField.type || audioMimeType;
      }
    } catch {
      return json({ error: 'Failed to parse form data' }, { status: 400 });
    }
  }

  // Mock mode: no API key or no audio
  if (!apiKey || !audioBuffer) {
    const mockText = 'create a plant-based tasting menu for 12 guests with Caribbean influence';
    const result = mockTranscriptResult(mockText);
    return json({
      transcript: result.transcript,
      confidence: 0.85,
      mockMode: true,
      telemetry: { ...buildMockTelemetry('voice-cleanup'), latencyMs: Date.now() - startMs },
    });
  }

  // Real Whisper transcription via OpenAI API
  try {
    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: audioMimeType });
    formData.append('file', blob, audioFilename);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[nanny/voice] Whisper error:', errText);
      const result = mockTranscriptResult('create a menu');
      return json({
        transcript: result.transcript,
        confidence: 0.5,
        mockMode: true,
        telemetry: { ...buildMockTelemetry('voice-cleanup'), latencyMs: Date.now() - startMs },
      });
    }

    const data = (await response.json()) as { text?: string };
    const transcript = data.text ?? '';
    const latencyMs = Date.now() - startMs;

    return json({
      transcript,
      confidence: 0.95,
      mockMode: false,
      telemetry: {
        model: 'whisper-1',
        provider: 'openai',
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: (audioBuffer.byteLength / 1_000_000) * 0.006,
        latencyMs,
        cacheHit: false,
        taskType: 'voice-cleanup',
        rationale: 'OpenAI Whisper speech-to-text',
      },
    });
  } catch (err) {
    console.error('[nanny/voice] Whisper fetch failed:', err);
    const result = mockTranscriptResult('create a menu');
    return json({
      transcript: result.transcript,
      confidence: 0.5,
      mockMode: true,
      telemetry: { ...buildMockTelemetry('voice-cleanup'), latencyMs: Date.now() - startMs },
    });
  }
};
