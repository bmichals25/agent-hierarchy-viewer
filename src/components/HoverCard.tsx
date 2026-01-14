'use client';

import { Agent, agents, teamNames } from '@/lib/agents';

interface HoverCardProps {
  agent: Agent | null;
}

export function HoverCard({ agent }: HoverCardProps) {
  if (!agent) return null;

  const directReports = agents.filter(a => a.reportsTo === agent.id);

  return (
    <div
      className="absolute bottom-4 left-4 w-80 bg-[#151515] border border-[#333] rounded-xl p-4 shadow-2xl z-50 animate-fade-in pointer-events-none"
      style={{
        boxShadow: `0 0 40px ${agent.color}20`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${agent.color}20` }}
        >
          {agent.icon}
        </div>
        <div>
          <div className="font-bold text-white">{agent.name}</div>
          <div className="text-xs" style={{ color: agent.color }}>
            {teamNames[agent.team]}
            {agent.phase && <span className="text-gray-500"> • {agent.phase}</span>}
          </div>
        </div>
      </div>

      {/* Role */}
      <p className="text-sm text-gray-400 mb-3 leading-relaxed">{agent.role}</p>

      {/* Quick stats */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Tools:</span>
          <span className="text-white">{agent.tools.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">Reports:</span>
          <span className="text-white">{directReports.length}</span>
        </div>
        {agent.phase && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Autonomy:</span>
            <span className="text-white">{getAutonomyLevel(agent.id)}</span>
          </div>
        )}
      </div>

      {/* Click hint */}
      <div className="mt-3 pt-3 border-t border-[#333] text-xs text-gray-500 text-center">
        Click to view full details
      </div>
    </div>
  );
}

function getAutonomyLevel(agentId: string): string {
  const levels: Record<string, string> = {
    'product-researcher': 'L1',
    'product-manager': 'L2',
    'architect': 'L1',
    'frontend-designer': 'L2',
    'developer': 'L0',
    'data-engineer': 'L0',
    'user-testing': 'L1',
    'code-reviewer': 'L0',
    'security-engineer': 'L2',
    'technical-writer': 'L0',
    'growth-marketer': 'L1',
    'devops-engineer': 'L1',
  };
  return levels[agentId] || 'N/A';
}
