'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Agent } from '@/lib/agents';

interface AgentNodeProps {
  data: {
    agent: Agent;
    isSelected: boolean;
    onClick: () => void;
  };
}

export const AgentNode = memo(function AgentNode({ data }: AgentNodeProps) {
  const { agent, isSelected, onClick } = data;

  return (
    <>
      {/* Input handle (from parent) */}
      {agent.reportsTo && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-transparent !border-0 !w-4 !h-4"
        />
      )}

      {/* Node content */}
      <div
        onClick={onClick}
        className={`
          px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
          border-2 min-w-[160px] backdrop-blur-sm
          ${isSelected
            ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-105'
            : 'border-transparent hover:border-white/20 hover:scale-102'
          }
        `}
        style={{
          backgroundColor: isSelected ? `${agent.color}30` : `${agent.color}15`,
          boxShadow: isSelected ? `0 0 30px ${agent.color}40` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${agent.color}30` }}
          >
            {agent.icon}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-white truncate">
              {agent.name.replace(' (Claude)', '')}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {agent.phase || getShortRole(agent.team)}
            </div>
          </div>
        </div>

        {/* Team color indicator */}
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
          style={{ backgroundColor: agent.color }}
        />
      </div>

      {/* Output handle (to children) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-4 !h-4"
      />
    </>
  );
});

function getShortRole(team: Agent['team']): string {
  const roles = {
    leadership: 'Leadership',
    engineering: 'Engineering',
    product: 'Product',
    design: 'Design & QA',
    support: 'Support',
  };
  return roles[team];
}
