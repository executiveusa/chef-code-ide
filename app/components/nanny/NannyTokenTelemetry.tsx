import type { TokenTelemetry } from '~/lib/nanny/llm-router';

interface NannyTokenTelemetryProps {
  telemetry: TokenTelemetry;
  compact?: boolean;
}

export function NannyTokenTelemetry({ telemetry, compact = false }: NannyTokenTelemetryProps) {
  const cost = telemetry.estimatedCostUsd.toFixed(4);
  const latency = (telemetry.latencyMs / 1000).toFixed(2);

  if (compact) {
    return (
      <div className="flex items-center gap-3 font-mono text-xs text-gray-500">
        <span>{telemetry.model}</span>
        <span>·</span>
        <span>{telemetry.totalTokens.toLocaleString()} tok</span>
        <span>·</span>
        <span>${cost}</span>
        <span>·</span>
        <span>{latency}s</span>
        {telemetry.cacheHit && <span className="text-emerald-600">cache ✓</span>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-gray-700">Token Telemetry</span>
        {telemetry.cacheHit && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Cache hit</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs text-gray-600">
        <span>Model</span>
        <span className="text-right">{telemetry.model}</span>
        <span>Provider</span>
        <span className="text-right">{telemetry.provider}</span>
        <span>Input tokens</span>
        <span className="text-right">{telemetry.inputTokens.toLocaleString()}</span>
        <span>Output tokens</span>
        <span className="text-right">{telemetry.outputTokens.toLocaleString()}</span>
        <span>Total tokens</span>
        <span className="text-right font-semibold">{telemetry.totalTokens.toLocaleString()}</span>
        <span>Est. cost</span>
        <span className="text-right font-semibold">${cost}</span>
        <span>Latency</span>
        <span className="text-right">{latency}s</span>
        <span>Task</span>
        <span className="text-right">{telemetry.taskType}</span>
      </div>
      <p className="mt-2 text-xs italic text-gray-500">{telemetry.rationale}</p>
    </div>
  );
}
