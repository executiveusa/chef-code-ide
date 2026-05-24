import { useState } from 'react';
import type { ServiceRunbook, ServiceTask } from '~/lib/nanny/modules/service-mode';
import { NannyAvatar } from './NannyAvatar';

interface NannyServiceModeProps {
  runbook: ServiceRunbook;
}

const PHASE_COLORS: Record<ServiceTask['phase'], string> = {
  prep: 'bg-amber-100 text-amber-800 border-amber-200',
  service: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cleanup: 'bg-gray-100 text-gray-700 border-gray-200',
};

const PHASE_LABELS: Record<ServiceTask['phase'], string> = {
  prep: 'Prep',
  service: 'Service',
  cleanup: 'Cleanup',
};

export function NannyServiceMode({ runbook }: NannyServiceModeProps) {
  const [activePhase, setActivePhase] = useState<ServiceTask['phase'] | 'all'>('all');
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const phases: Array<ServiceTask['phase'] | 'all'> = ['all', 'prep', 'service', 'cleanup'];

  const filtered = activePhase === 'all' ? runbook.timeline : runbook.timeline.filter((t) => t.phase === activePhase);

  function toggleTask(idx: number) {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  const totalTasks = runbook.timeline.length;
  const doneCount = completedTasks.size;
  const progress = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#1A3A1A] px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <NannyAvatar size="sm" status="service" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold">Service Mode</h1>
            <p className="truncate text-xs text-green-200">
              {runbook.location} · {runbook.guestCount} guests
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">{progress}%</div>
            <div className="text-xs text-green-200">
              {doneCount}/{totalTasks} tasks
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-green-800">
          <div
            className="h-full rounded-full bg-[#D4A853] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phase filter */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              activePhase === phase
                ? 'border-[#1A3A1A] bg-[#1A3A1A] text-white'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            {phase === 'all' ? 'All' : PHASE_LABELS[phase]}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3 px-4 pb-6">
        {filtered.map((task) => {
          const globalIdx = runbook.timeline.indexOf(task);
          const isDone = completedTasks.has(globalIdx);
          return (
            <button
              key={globalIdx}
              onClick={() => toggleTask(globalIdx)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                isDone ? 'border-gray-100 bg-gray-50 opacity-60' : 'border-gray-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    isDone ? 'border-[#1A3A1A] bg-[#1A3A1A]' : 'border-gray-300'
                  }`}
                >
                  {isDone && <span className="text-xs text-white">✓</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{task.time}</span>
                    <span className="text-xs text-gray-400">{task.duration}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${PHASE_COLORS[task.phase]}`}>
                      {PHASE_LABELS[task.phase]}
                    </span>
                    {task.critical && <span className="text-xs font-medium text-red-600">Critical</span>}
                  </div>
                  <p className={`text-sm ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.task}</p>
                  {task.contingency && !isDone && (
                    <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-700">⚠ {task.contingency}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Staff Checklist */}
      <div className="mx-4 mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-800">Staff Checklist</h2>
        <ul className="space-y-1">
          {runbook.staffChecklist.map((item, i) => (
            <li key={i} className="font-mono text-sm text-gray-600">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Contingency */}
      <div className="mx-4 mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-amber-800">Contingency Plan</h2>
        <ul className="space-y-1">
          {runbook.contingencyPlan.map((item, i) => (
            <li key={i} className="text-sm text-amber-700">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
