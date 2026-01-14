'use client';

import { memo } from 'react';

interface GroupNodeProps {
  data: {
    label: string;
    color: string;
    width: number;
    height: number;
  };
}

export const GroupNode = memo(function GroupNode({ data }: GroupNodeProps) {
  const { label, color, width, height } = data;

  return (
    <div
      className="rounded-2xl border-2 border-dashed"
      style={{
        width,
        height,
        backgroundColor: `${color}08`,
        borderColor: `${color}30`,
      }}
    >
      {/* Label */}
      <div
        className="absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-semibold"
        style={{
          backgroundColor: '#0a0a0a',
          color: color,
        }}
      >
        {label}
      </div>
    </div>
  );
});
