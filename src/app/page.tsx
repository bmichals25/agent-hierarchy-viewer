'use client';

import { useState } from 'react';
import { Agent, getAgentById, agents, teamNames } from '@/lib/agents';
import { FlowChart } from '@/components/FlowChart';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const reportsToAgent = selectedAgent?.reportsTo ? getAgentById(selectedAgent.reportsTo) : null;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[#222] bg-[#0f0f0f] px-6 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              🤖
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Agent Hierarchy</h1>
              <p className="text-xs text-gray-500">18 Agents | v2.0 | Click nodes to explore</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-gray-400">Leadership</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-gray-400">Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#06b6d4]" />
              <span className="text-gray-400">Product</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ec4899]" />
              <span className="text-gray-400">Design & QA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="text-gray-400">Support</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Flowchart */}
        <div className="flex-1 relative">
          <FlowChart
            onSelectAgent={handleSelectAgent}
            selectedId={selectedAgent?.id ?? null}
          />
        </div>

        {/* Detail Panel */}
        <div className={`
          w-96 bg-[#111] border-l border-[#222] overflow-y-auto transition-all duration-300
          ${selectedAgent ? 'translate-x-0' : 'translate-x-full absolute right-0 top-0 bottom-0'}
        `}>
          {selectedAgent ? (
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setSelectedAgent(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ backgroundColor: `${selectedAgent.color}20`, border: `2px solid ${selectedAgent.color}` }}
                >
                  {selectedAgent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold mb-1">{selectedAgent.name}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: `${selectedAgent.color}20`, color: selectedAgent.color }}
                    >
                      {teamNames[selectedAgent.team]}
                    </span>
                    {selectedAgent.phase && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-gray-400">
                        {selectedAgent.phase}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Role */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedAgent.role}</p>
              </div>

              {/* Reports To */}
              {reportsToAgent && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reports To</h3>
                  <button
                    onClick={() => handleSelectAgent(reportsToAgent)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <span className="text-lg">{reportsToAgent.icon}</span>
                    <span className="font-medium text-sm">{reportsToAgent.name}</span>
                    <svg className="w-4 h-4 text-gray-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Direct Reports */}
              {(() => {
                const directReports = agents.filter(a => a.reportsTo === selectedAgent.id);
                if (directReports.length === 0) return null;
                return (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Direct Reports ({directReports.length})
                    </h3>
                    <div className="space-y-1">
                      {directReports.map(report => (
                        <button
                          key={report.id}
                          onClick={() => handleSelectAgent(report)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors w-full text-left"
                        >
                          <span className="text-base">{report.icon}</span>
                          <span className="text-sm text-gray-300">{report.name}</span>
                          <div className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: report.color }} />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Responsibilities */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedAgent.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools Available</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400 border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Autonomy Level */}
              {selectedAgent.phase && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Autonomy Level</h3>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <AutonomyInfo agentId={selectedAgent.id} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">👈</div>
                <p>Click an agent node to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AutonomyInfo({ agentId }: { agentId: string }) {
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
  if (!info) return <span className="text-gray-500 text-sm">N/A</span>;

  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono font-bold text-lg"
        style={{ color: info.color }}
      >
        {info.level}
      </span>
      <span className="text-gray-400 text-sm">{info.description}</span>
    </div>
  );
}
