import { describe, it, expect } from 'vitest';
import { routeTask, buildMockTelemetry, estimateCost } from '~/lib/nanny/llm-router';

describe('llm-router', () => {
  it('routes menu-generation to large tier', () => {
    const decision = routeTask('menu-generation');
    expect(decision.modelTier).toBe('large');
    expect(decision.rationale).toBeTruthy();
  });

  it('routes voice-cleanup to fast tier', () => {
    const decision = routeTask('voice-cleanup');
    expect(decision.modelTier).toBe('fast');
  });

  it('routes vision-analysis to vision tier', () => {
    const decision = routeTask('vision-analysis');
    expect(decision.modelTier).toBe('vision');
  });

  it('routes long-context-planning to long-context tier', () => {
    const decision = routeTask('long-context-planning');
    expect(decision.modelTier).toBe('long-context');
  });

  it('buildMockTelemetry returns all required fields', () => {
    const t = buildMockTelemetry('menu-generation');
    expect(t.model).toBeTruthy();
    expect(t.provider).toBe('anthropic');
    expect(t.inputTokens).toBeGreaterThan(0);
    expect(t.outputTokens).toBeGreaterThan(0);
    expect(t.totalTokens).toBe(t.inputTokens + t.outputTokens);
    expect(t.estimatedCostUsd).toBeGreaterThan(0);
    expect(t.latencyMs).toBeGreaterThan(0);
    expect(typeof t.cacheHit).toBe('boolean');
    expect(t.taskType).toBe('menu-generation');
    expect(t.rationale).toBeTruthy();
  });

  it('estimateCost returns positive number', () => {
    const cost = estimateCost('large', 1000, 500);
    expect(cost).toBeGreaterThan(0);
  });

  it('fast tier costs less than large tier for same tokens', () => {
    const fast = estimateCost('fast', 1000, 500);
    const large = estimateCost('large', 1000, 500);
    expect(fast).toBeLessThan(large);
  });
});
