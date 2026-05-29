import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { routeTask, type TaskType, type TokenTelemetry } from '~/lib/nanny/llm-router';
import { getEnv } from '~/lib/.server/env';

interface RouterRequest {
  taskType: TaskType;
  prompt: string;
  systemPrompt?: string;
}

interface RouterResponse {
  text: string;
  telemetry: TokenTelemetry;
  mockMode: boolean;
}

export function getNannyMockMode(): boolean {
  return globalThis.process.env.NANNY_MOCK_MODE !== 'false';
}

function getAnthropicClient() {
  const apiKey = getEnv('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return null;
  }
  return createAnthropic({ apiKey });
}

export async function runNannyRouter(req: RouterRequest): Promise<RouterResponse> {
  const decision = routeTask(req.taskType);
  const startMs = Date.now();

  const anthropic = getAnthropicClient();
  const mockMode = getNannyMockMode() || !anthropic;

  if (mockMode || !anthropic) {
    return {
      text: '',
      telemetry: buildRealTelemetry({
        model: 'mock',
        provider: 'mock',
        inputTokens: 0,
        outputTokens: 0,
        cacheHit: false,
        latencyMs: 0,
        taskType: req.taskType,
        rationale: decision.rationale,
      }),
      mockMode: true,
    };
  }

  const modelMap: Record<string, string> = {
    fast: 'claude-haiku-4-5-20251001',
    medium: 'claude-sonnet-4-6',
    large: 'claude-sonnet-4-6',
    vision: 'claude-sonnet-4-6',
    'long-context': 'claude-sonnet-4-6',
  };
  const model = modelMap[decision.modelTier] ?? 'claude-sonnet-4-6';

  const result = await generateText({
    model: anthropic(model),
    system:
      req.systemPrompt ??
      'You are Nanny, a premium plant-based hospitality AI specializing in African, Caribbean, and diaspora cuisine. Be concise, precise, and practical.',
    prompt: req.prompt,
    maxTokens: 1500,
    experimental_providerMetadata: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  });

  const latencyMs = Date.now() - startMs;
  const usage = result.usage;
  const meta = result.experimental_providerMetadata?.anthropic as { cacheReadInputTokens?: number } | undefined;

  const inputTokens = usage?.promptTokens ?? 0;
  const outputTokens = usage?.completionTokens ?? 0;
  const cacheHit = (meta?.cacheReadInputTokens ?? 0) > 0;

  return {
    text: result.text,
    telemetry: buildRealTelemetry({
      model,
      provider: 'anthropic',
      inputTokens,
      outputTokens,
      cacheHit,
      latencyMs,
      taskType: req.taskType,
      rationale: decision.rationale,
    }),
    mockMode: false,
  };
}

function buildRealTelemetry(opts: {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  cacheHit: boolean;
  latencyMs: number;
  taskType: TaskType;
  rationale: string;
}): TokenTelemetry {
  const costPer1kIn = opts.provider === 'anthropic' ? 0.003 : 0;
  const costPer1kOut = opts.provider === 'anthropic' ? 0.015 : 0;
  const estimatedCostUsd = (opts.inputTokens / 1000) * costPer1kIn + (opts.outputTokens / 1000) * costPer1kOut;

  return {
    model: opts.model,
    provider: opts.provider,
    inputTokens: opts.inputTokens,
    outputTokens: opts.outputTokens,
    totalTokens: opts.inputTokens + opts.outputTokens,
    estimatedCostUsd,
    latencyMs: opts.latencyMs,
    cacheHit: opts.cacheHit,
    taskType: opts.taskType,
    rationale: opts.rationale,
  };
}
