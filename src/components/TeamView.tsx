'use client';

import { Agent, agents, teamNames, getTeamColor } from '@/lib/agents';

interface TeamViewProps {
  onSelect: (agent: Agent) => void;
  selectedId: string | null;
}

export function TeamView({ onSelect, selectedId }: TeamViewProps) {
  const teams: Agent['team'][] = ['leadership', 'engineering', 'product', 'design', 'support'];

  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>👥</span>
        <span>Team View</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const teamAgents = agents.filter(a => a.team === team);
          const color = getTeamColor(team);

          return (
            <div
              key={team}
              className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden"
            >
              {/* Team Header */}
              <div
                className="px-4 py-3 border-b border-[#2a2a2a]"
                style={{ backgroundColor: `${color}10` }}
              >
                <h3 className="font-semibold" style={{ color }}>
                  {teamNames[team]}
                </h3>
                <p className="text-xs text-gray-500">{teamAgents.length} agents</p>
              </div>

              {/* Team Members */}
              <div className="p-2">
                {teamAgents.map((agent) => {
                  const isSelected = selectedId === agent.id;
                  return (
                    <div
                      key={agent.id}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all
                        ${isSelected
                          ? 'bg-blue-500/20 border border-blue-500'
                          : 'hover:bg-white/5 border border-transparent'
                        }
                      `}
                      onClick={() => onSelect(agent)}
                    >
                      <span className="text-lg">{agent.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{agent.name}</div>
                        {agent.phase && (
                          <div className="text-xs text-gray-500">{agent.phase}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {teams.map((team) => {
          const count = agents.filter(a => a.team === team).length;
          const color = getTeamColor(team);
          return (
            <div
              key={team}
              className="p-4 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-center"
            >
              <div className="text-3xl font-bold" style={{ color }}>{count}</div>
              <div className="text-xs text-gray-500 mt-1">{teamNames[team]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
