'use client';

import { Agent, getChildAgents } from '@/lib/agents';
import { useState } from 'react';

interface AgentNodeProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  selectedId: string | null;
  level: number;
}

export function AgentNode({ agent, onSelect, selectedId, level }: AgentNodeProps) {
  const [expanded, setExpanded] = useState(level < 2);
  const children = getChildAgents(agent.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === agent.id;

  return (
    <div className="relative">
      {/* Node */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
          transition-all duration-200 border
          ${isSelected
            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
            : 'border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525] hover:border-[#3a3a3a]'
          }
        `}
        onClick={() => onSelect(agent)}
        style={{ marginLeft: level * 24 }}
      >
        {/* Expand/Collapse button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-5" />}

        {/* Icon */}
        <span className="text-xl">{agent.icon}</span>

        {/* Name and phase */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{agent.name}</div>
          {agent.phase && (
            <div className="text-xs text-gray-500">{agent.phase}</div>
          )}
        </div>

        {/* Team indicator */}
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: agent.color }}
        />
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-1 space-y-1 relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-4 w-px bg-[#2a2a2a]"
            style={{ marginLeft: level * 24 + 12 }}
          />
          {children.map((child) => (
            <AgentNode
              key={child.id}
              agent={child}
              onSelect={onSelect}
              selectedId={selectedId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
