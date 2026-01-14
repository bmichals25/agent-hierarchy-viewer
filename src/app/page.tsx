'use client';

import { useState, useMemo } from 'react';
import { Agent, getAgentById, agents, teamNames, getTeamColor } from '@/lib/agents';
import { FlowChart } from '@/components/FlowChart';
import { HoverCard } from '@/components/HoverCard';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<Agent['team']>>(new Set());

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const toggleFilter = (team: Agent['team']) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(team)) {
        next.delete(team);
      } else {
        next.add(team);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setSearchQuery('');
  };

  const reportsToAgent = selectedAgent?.reportsTo ? getAgentById(selectedAgent.reportsTo) : null;

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return agents.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  const teams: Agent['team'][] = ['leadership', 'engineering', 'product', 'design', 'support'];

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[#222] bg-[#0f0f0f] px-6 py-3 z-20">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              🤖
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Agent Hierarchy</h1>
              <p className="text-xs text-gray-500">18 Agents | v2.0</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-white"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden shadow-xl z-50">
                {searchResults.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      handleSelectAgent(agent);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-lg">{agent.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{agent.name}</div>
                      <div className="text-xs text-gray-500 truncate">{agent.role}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Team Filters */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-500 mr-1">Filter:</span>
            {teams.map(team => {
              const isActive = activeFilters.has(team);
              const color = getTeamColor(team);
              return (
                <button
                  key={team}
                  onClick={() => toggleFilter(team)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? `${color}30` : undefined,
                    borderColor: isActive ? color : 'transparent',
                    border: '1px solid',
                  }}
                >
                  {teamNames[team].replace(' Team', '').replace('VP ', '')}
                </button>
              );
            })}
            {(activeFilters.size > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Flowchart */}
        <div className="flex-1 relative">
          <FlowChart
            onSelectAgent={handleSelectAgent}
            selectedId={selectedAgent?.id ?? null}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            hoveredAgent={hoveredAgent}
            onHoverAgent={setHoveredAgent}
          />

          {/* Hover Card */}
          <HoverCard agent={hoveredAgent} />

          {/* Instructions overlay when nothing selected */}
          {!selectedAgent && !hoveredAgent && (
            <div className="absolute bottom-4 right-4 bg-[#151515]/90 border border-[#333] rounded-lg px-4 py-3 text-sm text-gray-400 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Scroll</kbd>
                <span>to zoom</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Drag</kbd>
                <span>to pan</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">Click</kbd>
                <span>to select agent</span>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div
          className={`
            w-96 bg-[#111] border-l border-[#222] overflow-y-auto transition-all duration-300 flex-shrink-0
            ${selectedAgent ? 'translate-x-0' : 'translate-x-full w-0 border-l-0'}
          `}
        >
          {selectedAgent && (
            <div className="p-6 animate-fade-in">
              {/* Close button */}
              <button
                onClick={() => setSelectedAgent(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors z-10"
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
