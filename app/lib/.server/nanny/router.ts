import { routeTask, buildMockTelemetry, type TaskType, type TokenTelemetry } from '~/lib/nanny/llm-router';

interface RouterRequest {
  taskType: TaskType;
  prompt?: string;
  context?: Record<string, unknown>;
}

interface RouterResponse {
  telemetry: TokenTelemetry;
  mockMode: boolean;
}

export async function runNannyRouter(req: RouterRequest): Promise<RouterResponse> {
  const decision = routeTask(req.taskType);
  const telemetry = buildMockTelemetry(req.taskType);

  return {
    telemetry: {
      ...telemetry,
      rationale: decision.rationale,
    },
    mockMode: true,
  };
}

export function getNannyMockMode(): boolean {
  return globalThis.process.env.NANNY_MOCK_MODE !== 'false';
}
