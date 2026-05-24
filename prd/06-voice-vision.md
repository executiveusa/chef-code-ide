# PRD-06: Voice and Vision

## Phase: 7

## Status: Partially Complete (mock infrastructure ready)

## Voice Console

### Done

- [x] Mock transcript processing (`voice-console.ts`)
- [x] Command parsing for 5 types
- [x] UI component (`NannyVoiceConsole.tsx`)
- [x] API route (`api.nanny.voice.transcript.ts`)

### Remaining

- [ ] Browser MediaRecorder integration (real mic input)
- [ ] WebSpeech API or AssemblyAI adapter
- [ ] Audio upload to server for transcription
- [ ] Real-time transcript streaming

## Vision Console

### Done

- [x] Mock vision analysis (`vision-console.ts`)
- [x] Structured extraction types
- [x] API route (`api.nanny.vision.analyze.ts`)

### Remaining

- [ ] File upload form component
- [ ] Multipart form handling in route
- [ ] Claude Vision / GPT-4V adapter
- [ ] PDF menu parsing
- [ ] Image → recipe extraction
- [ ] Image → runbook extraction

## Provider Adapters (Future)

### Voice

- AssemblyAI (primary)
- OpenAI Whisper (fallback)
- WebSpeech API (browser-only, no cost)

### Vision

- Claude claude-opus-4-7 (primary — best at structured extraction)
- GPT-4V (fallback)

## Acceptance Criteria

- Mock mode: all routes return 200 with structured data
- Live mode: requires ASSEMBLYAI_API_KEY or OPENAI_API_KEY
- No browser keys ever
