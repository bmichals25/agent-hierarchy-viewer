'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Agent } from '@/lib/agents';

interface AgentNodeProps {
  data: {
    agent: Agent;
    isSelected: boolean;
    isHighlighted: boolean;
    isHovered: boolean;
    isDimmed: boolean;
    onClick: () => void;
    onHover: (hover: boolean) => void;
  };
}

export const AgentNode = memo(function AgentNode({ data }: AgentNodeProps) {
  const { agent, isSelected, isHighlighted, isHovered, isDimmed, onClick, onHover } = data;

  const showGlow = isSelected || isHighlighted;

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
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`
          px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
          border-2 min-w-[160px] backdrop-blur-sm relative
          ${isSelected
            ? 'border-blue-400 scale-105'
            : isHighlighted
              ? 'border-white/40'
              : isHovered
                ? 'border-white/30 scale-102'
                : 'border-transparent hover:border-white/20'
          }
          ${isDimmed ? 'opacity-30' : 'opacity-100'}
        `}
        style={{
          backgroundColor: showGlow ? `${agent.color}30` : `${agent.color}15`,
          boxShadow: showGlow ? `0 0 30px ${agent.color}50` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 transition-transform"
            style={{
              backgroundColor: `${agent.color}30`,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
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
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-all"
          style={{
            backgroundColor: agent.color,
            width: isSelected ? '50%' : '30%',
          }}
        />

        {/* Selection ring animation */}
        {isSelected && (
          <div
            className="absolute inset-0 rounded-xl border-2 animate-pulse pointer-events-none"
            style={{ borderColor: agent.color }}
          />
        )}
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
