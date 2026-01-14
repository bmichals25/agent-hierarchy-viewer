'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Agent, agents } from '@/lib/agents';
import { AgentNode } from './AgentFlowNode';

const nodeTypes = {
  agent: AgentNode,
};

interface FlowChartProps {
  onSelectAgent: (agent: Agent) => void;
  selectedId: string | null;
}

export function FlowChart({ onSelectAgent, selectedId }: FlowChartProps) {
  // Calculate node positions for hierarchy layout
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Layout configuration
    const nodeWidth = 180;
    const nodeHeight = 70;
    const horizontalGap = 40;
    const verticalGap = 100;

    // Level assignments
    const levels: Record<string, number> = {
      'ceo': 0,
      'chief-of-staff': 1,
      'pipeline-manager': 1,
      'vp-engineering': 1,
      'vp-product': 1,
      'vp-design': 1,
      'support-agent': 2,
      'autopilot-agent': 2,
      'architect': 2,
      'developer': 2,
      'devops-engineer': 2,
      'code-reviewer': 2,
      'security-engineer': 2,
      'product-researcher': 2,
      'product-manager': 2,
      'data-engineer': 2,
      'growth-marketer': 2,
      'frontend-designer': 2,
      'user-testing': 2,
      'technical-writer': 2,
    };

    // Group agents by level
    const agentsByLevel: Record<number, Agent[]> = {};
    agents.forEach(agent => {
      const level = levels[agent.id] ?? 2;
      if (!agentsByLevel[level]) agentsByLevel[level] = [];
      agentsByLevel[level].push(agent);
    });

    // Order within each level for better visual grouping
    const levelOrder: Record<number, string[]> = {
      0: ['ceo'],
      1: ['chief-of-staff', 'pipeline-manager', 'vp-engineering', 'vp-product', 'vp-design'],
      2: [
        'support-agent', 'autopilot-agent',
        'architect', 'developer', 'devops-engineer', 'code-reviewer', 'security-engineer',
        'product-researcher', 'product-manager', 'data-engineer', 'growth-marketer',
        'frontend-designer', 'user-testing', 'technical-writer'
      ],
    };

    // Calculate positions
    Object.entries(levelOrder).forEach(([levelStr, agentIds]) => {
      const level = parseInt(levelStr);
      const y = level * (nodeHeight + verticalGap);
      const totalWidth = agentIds.length * nodeWidth + (agentIds.length - 1) * horizontalGap;
      const startX = -totalWidth / 2;

      agentIds.forEach((agentId, index) => {
        const agent = agents.find(a => a.id === agentId);
        if (!agent) return;

        const x = startX + index * (nodeWidth + horizontalGap);

        nodes.push({
          id: agent.id,
          type: 'agent',
          position: { x, y },
          data: {
            agent,
            isSelected: selectedId === agent.id,
            onClick: () => onSelectAgent(agent),
          },
        });

        // Create edge to parent
        if (agent.reportsTo) {
          edges.push({
            id: `${agent.reportsTo}-${agent.id}`,
            source: agent.reportsTo,
            target: agent.id,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#444', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#444',
              width: 20,
              height: 20,
            },
          });
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [selectedId, onSelectAgent]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection changes
  useMemo(() => {
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        data: {
          ...node.data,
          isSelected: selectedId === node.id,
        },
      }))
    );
  }, [selectedId, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#222" gap={20} />
        <Controls
          className="!bg-[#1a1a1a] !border-[#333] !rounded-lg overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-[#1a1a1a] !border-[#333]"
          nodeColor={(node) => {
            const agent = agents.find(a => a.id === node.id);
            return agent?.color || '#666';
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
        />
      </ReactFlow>
    </div>
  );
}
