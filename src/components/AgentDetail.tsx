'use client';

import { Agent, getAgentById, teamNames } from '@/lib/agents';

interface AgentDetailProps {
  agent: Agent | null;
}

export function AgentDetail({ agent }: AgentDetailProps) {
  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">👈</div>
          <p>Select an agent to view details</p>
        </div>
      </div>
    );
  }

  const reportsToAgent = agent.reportsTo ? getAgentById(agent.reportsTo) : null;

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}` }}
        >
          {agent.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{agent.name}</h2>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
            >
              {teamNames[agent.team]}
            </span>
            {agent.phase && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-gray-400">
                {agent.phase}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Role */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Role</h3>
        <p className="text-gray-300 leading-relaxed">{agent.role}</p>
      </div>

      {/* Reports To */}
      {reportsToAgent && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Reports To</h3>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-lg">{reportsToAgent.icon}</span>
            <span className="font-medium">{reportsToAgent.name}</span>
          </div>
        </div>
      )}

      {/* Responsibilities */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Responsibilities</h3>
        <ul className="space-y-2">
          {agent.responsibilities.map((resp, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tools */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Tools Available</h3>
        <div className="flex flex-wrap gap-2">
          {agent.tools.map((tool, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-sm bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Autonomy Level (if applicable) */}
      {agent.phase && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Autonomy Level</h3>
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            {getAutonomyInfo(agent.id)}
          </div>
        </div>
      )}
    </div>
  );
}

function getAutonomyInfo(agentId: string): React.ReactNode {
  const autonomyMap: Record<string, { level: string; description: string; color: string }> = {
    'product-researcher': { level: 'L1', description: 'Auto-approve if GO + 3 sources', color: '#22c55e' },
    'product-manager': { level: 'L2', description: 'Always requires checkpoint', color: '#f59e0b' },
    'architect': { level: 'L1', description: 'Auto-approve if standard stack', color: '#22c55e' },
    'frontend-designer': { level: 'L2', description: 'Always requires checkpoint', color: '#f59e0b' },
    'developer': { level: 'L0', description: 'Auto-approve if build + tests pass', color: '#3b82f6' },
    'data-engineer': { level: 'L0', description: 'Auto-approve on completion', color: '#3b82f6' },
    'user-testing': { level: 'L1', description: 'Auto-approve if no P0/P1 bugs', color: '#22c55e' },
    'code-reviewer': { level: 'L0', description: 'Auto-approve if no critical issues', color: '#3b82f6' },
    'security-engineer': { level: 'L2', description: 'Always requires checkpoint', color: '#f59e0b' },
    'technical-writer': { level: 'L0', description: 'Auto-approve if docs complete', color: '#3b82f6' },
    'growth-marketer': { level: 'L1', description: 'Auto-approve if plan complete', color: '#22c55e' },
    'devops-engineer': { level: 'L1', description: 'Auto-approve if CI/CD passes', color: '#22c55e' },
  };

  const info = autonomyMap[agentId];
  if (!info) return <span className="text-gray-500">N/A</span>;

  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-mono font-bold mr-2" style={{ color: info.color }}>{info.level}</span>
        <span className="text-gray-400">{info.description}</span>
      </div>
    </div>
  );
}
