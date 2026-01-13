'use client';

import { useState } from 'react';
import { Agent, agents, getAgentById } from '@/lib/agents';
import { AgentNode } from '@/components/AgentNode';
import { AgentDetail } from '@/components/AgentDetail';
import { PipelineView } from '@/components/PipelineView';
import { TeamView } from '@/components/TeamView';

type ViewMode = 'hierarchy' | 'pipeline' | 'teams';

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');

  const selectedAgent = selectedAgentId ? getAgentById(selectedAgentId) : null;
  const ceo = agents.find(a => a.reportsTo === null);

  const handleSelect = (agent: Agent) => {
    setSelectedAgentId(agent.id);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0f0f0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h1 className="text-lg font-bold">Agent Hierarchy</h1>
                <p className="text-xs text-gray-500">18 Agents | v2.0</p>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg">
              {(['hierarchy', 'pipeline', 'teams'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${viewMode === mode
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {mode === 'hierarchy' && '🌳 Hierarchy'}
                  {mode === 'pipeline' && '🔄 Pipeline'}
                  {mode === 'teams' && '👥 Teams'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Left Panel - Tree/Pipeline/Teams */}
          <div className="w-1/2 border-r border-[#2a2a2a] overflow-y-auto">
            {viewMode === 'hierarchy' && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>🌳</span>
                  <span>Organization Tree</span>
                </h2>
                {ceo && (
                  <AgentNode
                    agent={ceo}
                    onSelect={handleSelect}
                    selectedId={selectedAgentId}
                    level={0}
                  />
                )}
              </div>
            )}

            {viewMode === 'pipeline' && (
              <PipelineView onSelect={handleSelect} selectedId={selectedAgentId} />
            )}

            {viewMode === 'teams' && (
              <TeamView onSelect={handleSelect} selectedId={selectedAgentId} />
            )}
          </div>

          {/* Right Panel - Agent Detail */}
          <div className="w-1/2 bg-[#0a0a0a]">
            <AgentDetail agent={selectedAgent ?? null} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <div>Built for Ben&apos;s Agent Team</div>
          <div className="flex items-center gap-4">
            <span>Leadership: 4</span>
            <span>Engineering: 5</span>
            <span>Product: 4</span>
            <span>Design & QA: 3</span>
            <span>Support: 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
