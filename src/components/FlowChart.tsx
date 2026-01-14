'use client';

import { useCallback, useMemo, useState } from 'react';
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
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Agent, agents, getTeamColor, teamNames } from '@/lib/agents';
import { AgentNode } from './AgentFlowNode';
import { GroupNode } from './GroupNode';

const nodeTypes = {
  agent: AgentNode,
  group: GroupNode,
};

interface FlowChartProps {
  onSelectAgent: (agent: Agent) => void;
  selectedId: string | null;
  searchQuery: string;
  activeFilters: Set<Agent['team']>;
  hoveredAgent: Agent | null;
  onHoverAgent: (agent: Agent | null) => void;
}

export function FlowChart({
  onSelectAgent,
  selectedId,
  searchQuery,
  activeFilters,
  hoveredAgent,
  onHoverAgent,
}: FlowChartProps) {

  // Build the highlight path (selected agent's reporting chain)
  const highlightPath = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const path = new Set<string>();
    let current = agents.find(a => a.id === selectedId);

    // Add ancestors
    while (current) {
      path.add(current.id);
      if (current.reportsTo) {
        path.add(`${current.reportsTo}-${current.id}`); // edge id
      }
      current = current.reportsTo ? agents.find(a => a.id === current!.reportsTo) : undefined;
    }

    // Add descendants
    const addDescendants = (parentId: string) => {
      agents.filter(a => a.reportsTo === parentId).forEach(child => {
        path.add(child.id);
        path.add(`${parentId}-${child.id}`);
        addDescendants(child.id);
      });
    };
    addDescendants(selectedId);

    return path;
  }, [selectedId]);

  // Calculate node positions with VP grouping
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const nodeWidth = 180;
    const nodeHeight = 70;
    const horizontalGap = 30;
    const verticalGap = 120;
    const groupPadding = 30;

    // Check if agent matches filters and search
    const isVisible = (agent: Agent) => {
      if (activeFilters.size > 0 && !activeFilters.has(agent.team)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return agent.name.toLowerCase().includes(query) ||
               agent.role.toLowerCase().includes(query);
      }
      return true;
    };

    // CEO at top
    const ceo = agents.find(a => a.id === 'ceo')!;
    const ceoVisible = isVisible(ceo);
    nodes.push({
      id: 'ceo',
      type: 'agent',
      position: { x: 0, y: 0 },
      data: {
        agent: ceo,
        isSelected: selectedId === 'ceo',
        isHighlighted: highlightPath.has('ceo'),
        isHovered: hoveredAgent?.id === 'ceo',
        isDimmed: !ceoVisible,
        onClick: () => onSelectAgent(ceo),
        onHover: (hover: boolean) => onHoverAgent(hover ? ceo : null),
      },
    });

    // Level 1: Direct reports to CEO (VPs + Chief of Staff + Pipeline Manager)
    const level1Agents = ['chief-of-staff', 'pipeline-manager', 'vp-engineering', 'vp-product', 'vp-design'];
    const level1Width = level1Agents.length * nodeWidth + (level1Agents.length - 1) * horizontalGap;
    const level1StartX = -level1Width / 2;

    level1Agents.forEach((agentId, index) => {
      const agent = agents.find(a => a.id === agentId)!;
      if (!agent) return;
      const visible = isVisible(agent);

      nodes.push({
        id: agent.id,
        type: 'agent',
        position: {
          x: level1StartX + index * (nodeWidth + horizontalGap),
          y: nodeHeight + verticalGap
        },
        data: {
          agent,
          isSelected: selectedId === agent.id,
          isHighlighted: highlightPath.has(agent.id),
          isHovered: hoveredAgent?.id === agent.id,
          isDimmed: !visible,
          onClick: () => onSelectAgent(agent),
          onHover: (hover: boolean) => onHoverAgent(hover ? agent : null),
        },
      });

      edges.push({
        id: `ceo-${agent.id}`,
        source: 'ceo',
        target: agent.id,
        type: 'smoothstep',
        style: {
          stroke: highlightPath.has(`ceo-${agent.id}`) ? agent.color : '#333',
          strokeWidth: highlightPath.has(`ceo-${agent.id}`) ? 3 : 2,
          opacity: visible && ceoVisible ? 1 : 0.2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: highlightPath.has(`ceo-${agent.id}`) ? agent.color : '#333',
          width: 16,
          height: 16,
        },
      });
    });

    // VP Groups with their teams
    const vpGroups: { vpId: string; members: string[]; x: number; color: string; label: string }[] = [
      {
        vpId: 'chief-of-staff',
        members: ['support-agent'],
        x: level1StartX,
        color: '#8b5cf6',
        label: 'Admin',
      },
      {
        vpId: 'pipeline-manager',
        members: ['autopilot-agent'],
        x: level1StartX + (nodeWidth + horizontalGap),
        color: '#10b981',
        label: 'Pipeline',
      },
      {
        vpId: 'vp-engineering',
        members: ['architect', 'developer', 'devops-engineer', 'code-reviewer', 'security-engineer'],
        x: level1StartX + 2 * (nodeWidth + horizontalGap),
        color: '#ef4444',
        label: 'Engineering',
      },
      {
        vpId: 'vp-product',
        members: ['product-researcher', 'product-manager', 'data-engineer', 'growth-marketer'],
        x: level1StartX + 3 * (nodeWidth + horizontalGap),
        color: '#06b6d4',
        label: 'Product',
      },
      {
        vpId: 'vp-design',
        members: ['frontend-designer', 'user-testing', 'technical-writer'],
        x: level1StartX + 4 * (nodeWidth + horizontalGap),
        color: '#ec4899',
        label: 'Design & QA',
      },
    ];

    const level2Y = 2 * (nodeHeight + verticalGap);

    vpGroups.forEach((group) => {
      const vpAgent = agents.find(a => a.id === group.vpId);
      if (!vpAgent) return;

      // Add group background node
      const groupWidth = nodeWidth + groupPadding * 2;
      const groupHeight = group.members.length * (nodeHeight + 20) + groupPadding * 2 + 30;

      nodes.push({
        id: `group-${group.vpId}`,
        type: 'group',
        position: {
          x: group.x - groupPadding,
          y: level2Y - groupPadding
        },
        data: {
          label: group.label,
          color: group.color,
          width: groupWidth,
          height: groupHeight,
        },
        style: { zIndex: -1 },
      });

      // Add member nodes inside group
      group.members.forEach((memberId, memberIndex) => {
        const member = agents.find(a => a.id === memberId);
        if (!member) return;
        const visible = isVisible(member);
        const parentVisible = isVisible(vpAgent);

        nodes.push({
          id: member.id,
          type: 'agent',
          position: {
            x: group.x,
            y: level2Y + memberIndex * (nodeHeight + 20) + 30
          },
          data: {
            agent: member,
            isSelected: selectedId === member.id,
            isHighlighted: highlightPath.has(member.id),
            isHovered: hoveredAgent?.id === member.id,
            isDimmed: !visible,
            onClick: () => onSelectAgent(member),
            onHover: (hover: boolean) => onHoverAgent(hover ? member : null),
          },
        });

        // Edge from VP to member
        edges.push({
          id: `${group.vpId}-${member.id}`,
          source: group.vpId,
          target: member.id,
          type: 'smoothstep',
          style: {
            stroke: highlightPath.has(`${group.vpId}-${member.id}`) ? group.color : '#333',
            strokeWidth: highlightPath.has(`${group.vpId}-${member.id}`) ? 3 : 2,
            opacity: visible && parentVisible ? 1 : 0.2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: highlightPath.has(`${group.vpId}-${member.id}`) ? group.color : '#333',
            width: 16,
            height: 16,
          },
        });
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [selectedId, searchQuery, activeFilters, highlightPath, hoveredAgent, onSelectAgent, onHoverAgent]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when props change
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1a1a1a" gap={20} />
        <Controls
          className="!bg-[#1a1a1a] !border-[#333] !rounded-lg overflow-hidden [&>button]:!bg-[#1a1a1a] [&>button]:!border-[#333] [&>button:hover]:!bg-[#252525] [&>button]:!text-gray-400"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-[#1a1a1a] !border-[#333] !rounded-lg"
          nodeColor={(node) => {
            if (node.type === 'group') return 'transparent';
            const agent = agents.find(a => a.id === node.id);
            return agent?.color || '#666';
          }}
          maskColor="rgba(0, 0, 0, 0.8)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
