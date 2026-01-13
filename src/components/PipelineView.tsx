'use client';

import { Agent, agents } from '@/lib/agents';

interface PipelineViewProps {
  onSelect: (agent: Agent) => void;
  selectedId: string | null;
}

const pipelinePhases = [
  { phase: '1', name: 'Intake', agent: 'ceo', parallel: false },
  { phase: '2', name: 'Research', agent: 'product-researcher', parallel: false },
  { phase: '3A', name: 'Spec', agent: 'product-manager', parallel: true },
  { phase: '3B', name: 'Architecture', agent: 'architect', parallel: true },
  { phase: '4', name: 'Design', agent: 'frontend-designer', parallel: false },
  { phase: '5A', name: 'Development', agent: 'developer', parallel: true },
  { phase: '5B', name: 'Analytics', agent: 'data-engineer', parallel: true },
  { phase: '6A', name: 'Testing', agent: 'user-testing', parallel: true },
  { phase: '6B', name: 'Code Review', agent: 'code-reviewer', parallel: true },
  { phase: '7', name: 'Security', agent: 'security-engineer', parallel: false },
  { phase: '8A', name: 'Docs', agent: 'technical-writer', parallel: true },
  { phase: '8B', name: 'Launch Prep', agent: 'growth-marketer', parallel: true },
  { phase: '9', name: 'DevOps', agent: 'devops-engineer', parallel: false },
  { phase: '10', name: 'Launched', agent: 'ceo', parallel: false },
];

export function PipelineView({ onSelect, selectedId }: PipelineViewProps) {
  const getAgent = (id: string) => agents.find(a => a.id === id);

  // Group parallel phases
  const groupedPhases: { phases: typeof pipelinePhases; isParallel: boolean }[] = [];
  let currentGroup: typeof pipelinePhases = [];
  let inParallel = false;

  pipelinePhases.forEach((p, i) => {
    if (p.parallel && !inParallel) {
      if (currentGroup.length > 0) {
        groupedPhases.push({ phases: currentGroup, isParallel: false });
      }
      currentGroup = [p];
      inParallel = true;
    } else if (p.parallel && inParallel) {
      currentGroup.push(p);
    } else if (!p.parallel && inParallel) {
      groupedPhases.push({ phases: currentGroup, isParallel: true });
      currentGroup = [p];
      inParallel = false;
    } else {
      if (currentGroup.length > 0 && !inParallel) {
        groupedPhases.push({ phases: currentGroup, isParallel: false });
      }
      currentGroup = [p];
    }

    if (i === pipelinePhases.length - 1) {
      groupedPhases.push({ phases: currentGroup, isParallel: inParallel });
    }
  });

  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>🔄</span>
        <span>Pipeline Workflow v2.0</span>
      </h2>

      <div className="relative">
        {groupedPhases.map((group, gi) => (
          <div key={gi} className="mb-4">
            {group.isParallel ? (
              <div className="flex gap-4">
                {group.phases.map((p, pi) => {
                  const agent = getAgent(p.agent);
                  if (!agent) return null;
                  const isSelected = selectedId === agent.id;

                  return (
                    <div
                      key={pi}
                      className={`
                        flex-1 p-4 rounded-lg border cursor-pointer transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525]'
                        }
                      `}
                      onClick={() => onSelect(agent)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10">
                          {p.phase}
                        </span>
                        <span className="text-xs text-gray-500">PARALLEL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{agent.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500">{agent.name}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              group.phases.map((p, pi) => {
                const agent = getAgent(p.agent);
                if (!agent) return null;
                const isSelected = selectedId === agent.id;

                return (
                  <div
                    key={pi}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all mb-2
                      ${isSelected
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525]'
                      }
                    `}
                    onClick={() => onSelect(agent)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 min-w-[48px] text-center">
                        {p.phase}
                      </span>
                      <span className="text-xl">{agent.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500">{agent.name}</div>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: agent.color }}
                      />
                    </div>
                  </div>
                );
              })
            )}

            {/* Connector */}
            {gi < groupedPhases.length - 1 && (
              <div className="flex justify-center py-2">
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-600">
                  <path
                    d="M12 4v16m0 0l-4-4m4 4l4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
