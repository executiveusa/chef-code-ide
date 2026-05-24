export type VoiceCommandType =
  | 'create-menu'
  | 'plan-event'
  | 'generate-provisioning'
  | 'start-service-mode'
  | 'generate-flyer'
  | 'unknown';

export interface ParsedVoiceCommand {
  commandType: VoiceCommandType;
  parameters: Record<string, string | number | string[]>;
  confidence: number;
  rawTranscript: string;
  needsConfirmation: boolean;
  confirmationPrompt?: string;
}

export interface TranscriptResult {
  transcript: string;
  command: ParsedVoiceCommand;
  telemetry: {
    latencyMs: number;
    wordCount: number;
    model: string;
  };
}

export function parseVoiceTranscript(transcript: string): ParsedVoiceCommand {
  const lower = transcript.toLowerCase();

  if (lower.includes('menu') || lower.includes('cook') || lower.includes('dish')) {
    return {
      commandType: 'create-menu',
      parameters: extractMenuParams(lower),
      confidence: 0.85,
      rawTranscript: transcript,
      needsConfirmation: true,
      confirmationPrompt: 'Create a plant-based Afro-Caribbean menu — is that right?',
    };
  }

  if (
    lower.includes('event') ||
    lower.includes('plan') ||
    lower.includes('dinner party') ||
    lower.includes('catering')
  ) {
    return {
      commandType: 'plan-event',
      parameters: extractEventParams(lower),
      confidence: 0.82,
      rawTranscript: transcript,
      needsConfirmation: true,
      confirmationPrompt: 'Plan a service event — confirm details?',
    };
  }

  if (
    lower.includes('shopping') ||
    lower.includes('provision') ||
    lower.includes('groceries') ||
    lower.includes('ingredients')
  ) {
    return {
      commandType: 'generate-provisioning',
      parameters: {},
      confidence: 0.88,
      rawTranscript: transcript,
      needsConfirmation: false,
    };
  }

  if (
    lower.includes('service') ||
    lower.includes('runbook') ||
    lower.includes('timeline') ||
    lower.includes('schedule')
  ) {
    return {
      commandType: 'start-service-mode',
      parameters: {},
      confidence: 0.79,
      rawTranscript: transcript,
      needsConfirmation: true,
      confirmationPrompt: 'Generate service runbook — ready to start?',
    };
  }

  if (lower.includes('flyer') || lower.includes('post') || lower.includes('creative') || lower.includes('instagram')) {
    return {
      commandType: 'generate-flyer',
      parameters: extractCreativeParams(lower),
      confidence: 0.76,
      rawTranscript: transcript,
      needsConfirmation: true,
      confirmationPrompt: 'Generate creative assets — what type?',
    };
  }

  return {
    commandType: 'unknown',
    parameters: {},
    confidence: 0.0,
    rawTranscript: transcript,
    needsConfirmation: true,
    confirmationPrompt: 'I did not recognize that command. What would you like to do?',
  };
}

function extractMenuParams(text: string): Record<string, string | number | string[]> {
  const params: Record<string, string | number | string[]> = {};
  const guestMatch = text.match(/(\d+)\s*(?:guest|person|people)/);
  if (guestMatch) {
    params.guestCount = parseInt(guestMatch[1], 10);
  }
  if (text.includes('vegan') || text.includes('plant')) {
    params.dietaryNeeds = ['vegan'];
  }
  return params;
}

function extractEventParams(text: string): Record<string, string | number | string[]> {
  const params: Record<string, string | number | string[]> = {};
  const guestMatch = text.match(/(\d+)\s*(?:guest|person|people)/);
  if (guestMatch) {
    params.guestCount = parseInt(guestMatch[1], 10);
  }
  if (text.includes('wedding')) {
    params.eventType = 'wedding';
  } else if (text.includes('birthday')) {
    params.eventType = 'birthday';
  } else if (text.includes('corporate')) {
    params.eventType = 'corporate';
  } else {
    params.eventType = 'dinner-party';
  }
  return params;
}

function extractCreativeParams(text: string): Record<string, string | number | string[]> {
  const params: Record<string, string | number | string[]> = {};
  if (text.includes('instagram') || text.includes('post')) {
    params.assetType = 'social-post';
  } else if (text.includes('flyer')) {
    params.assetType = 'event-flyer';
  } else {
    params.assetType = 'social-post';
  }
  return params;
}

export function mockTranscriptResult(rawText: string): TranscriptResult {
  const command = parseVoiceTranscript(rawText);
  return {
    transcript: rawText,
    command,
    telemetry: {
      latencyMs: 250 + Math.floor(Math.random() * 150),
      wordCount: rawText.split(/\s+/).length,
      model: 'claude-haiku-4-5',
    },
  };
}
