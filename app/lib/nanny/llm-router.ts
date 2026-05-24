export type TaskType =
  | 'quick-answer'
  | 'deep-reasoning'
  | 'code-generation'
  | 'design-critique'
  | 'menu-generation'
  | 'nutrition-reasoning'
  | 'vision-analysis'
  | 'voice-cleanup'
  | 'creative-copy'
  | 'tool-calling'
  | 'long-context-planning'
  | 'event-planning'
  | 'provisioning';

export type ModelTier = 'fast' | 'medium' | 'large' | 'vision' | 'long-context';

export interface RoutingDecision {
  taskType: TaskType;
  modelTier: ModelTier;
  rationale: string;
}

export interface TokenTelemetry {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  cacheHit: boolean;
  taskType: TaskType;
  rationale: string;
}

const TASK_ROUTING: Record<TaskType, RoutingDecision> = {
  'quick-answer': { taskType: 'quick-answer', modelTier: 'fast', rationale: 'Low-latency response needed' },
  'deep-reasoning': { taskType: 'deep-reasoning', modelTier: 'large', rationale: 'Complex multi-step reasoning' },
  'code-generation': {
    taskType: 'code-generation',
    modelTier: 'large',
    rationale: 'Precision and correctness required',
  },
  'design-critique': {
    taskType: 'design-critique',
    modelTier: 'medium',
    rationale: 'Creative judgment at moderate cost',
  },
  'menu-generation': { taskType: 'menu-generation', modelTier: 'large', rationale: 'Creative + structured output' },
  'nutrition-reasoning': {
    taskType: 'nutrition-reasoning',
    modelTier: 'medium',
    rationale: 'Domain knowledge sufficient in medium tier',
  },
  'vision-analysis': { taskType: 'vision-analysis', modelTier: 'vision', rationale: 'Multimodal capability required' },
  'voice-cleanup': { taskType: 'voice-cleanup', modelTier: 'fast', rationale: 'Low-latency transcript correction' },
  'creative-copy': { taskType: 'creative-copy', modelTier: 'medium', rationale: 'Creative writing at moderate cost' },
  'tool-calling': { taskType: 'tool-calling', modelTier: 'large', rationale: 'Reliable function calling' },
  'long-context-planning': {
    taskType: 'long-context-planning',
    modelTier: 'long-context',
    rationale: 'Full event in single context',
  },
  'event-planning': { taskType: 'event-planning', modelTier: 'large', rationale: 'Complex multi-domain planning' },
  provisioning: { taskType: 'provisioning', modelTier: 'medium', rationale: 'Structured list generation' },
};

const TOKEN_COST_PER_1K: Record<ModelTier, { input: number; output: number }> = {
  fast: { input: 0.00025, output: 0.00125 },
  medium: { input: 0.003, output: 0.015 },
  large: { input: 0.015, output: 0.075 },
  vision: { input: 0.01, output: 0.04 },
  'long-context': { input: 0.015, output: 0.075 },
};

const MODEL_NAMES: Record<ModelTier, string> = {
  fast: 'claude-haiku-4-5',
  medium: 'claude-sonnet-4-6',
  large: 'claude-opus-4-7',
  vision: 'claude-sonnet-4-6',
  'long-context': 'claude-opus-4-7',
};

export function routeTask(taskType: TaskType): RoutingDecision {
  return TASK_ROUTING[taskType];
}

export function estimateCost(tier: ModelTier, inputTokens: number, outputTokens: number): number {
  const rates = TOKEN_COST_PER_1K[tier];
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

export function buildMockTelemetry(taskType: TaskType, latencyMs?: number): TokenTelemetry {
  const decision = routeTask(taskType);
  const inputTokens = 800 + Math.floor(Math.random() * 400);
  const outputTokens = 200 + Math.floor(Math.random() * 600);
  return {
    model: MODEL_NAMES[decision.modelTier],
    provider: 'anthropic',
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: estimateCost(decision.modelTier, inputTokens, outputTokens),
    latencyMs: latencyMs ?? 800 + Math.floor(Math.random() * 1200),
    cacheHit: Math.random() > 0.7,
    taskType,
    rationale: decision.rationale,
  };
}
