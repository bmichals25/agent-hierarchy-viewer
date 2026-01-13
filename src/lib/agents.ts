export interface Agent {
  id: string;
  name: string;
  role: string;
  reportsTo: string | null;
  team: 'leadership' | 'engineering' | 'product' | 'design' | 'support';
  phase?: string;
  tools: string[];
  responsibilities: string[];
  color: string;
  icon: string;
}

export const agents: Agent[] = [
  // Leadership
  {
    id: 'ceo',
    name: 'CEO (Claude)',
    role: 'Strategic orchestration, user interaction, multi-agent coordination',
    reportsTo: null,
    team: 'leadership',
    tools: ['All tools', 'Task delegation', 'Direct user communication'],
    responsibilities: [
      'Strategic decision making',
      'User interaction and communication',
      'Multi-agent coordination',
      'Final approvals on critical decisions'
    ],
    color: '#3b82f6',
    icon: '👑'
  },
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff',
    role: 'Notion ops, business tracking, admin coordination',
    reportsTo: 'ceo',
    team: 'leadership',
    tools: ['Notion MCP', 'Bash', 'Read/Write', 'WebFetch'],
    responsibilities: [
      'Notion workspace management',
      'Business venture tracking',
      'Memory management',
      'Task board coordination'
    ],
    color: '#8b5cf6',
    icon: '📋'
  },
  {
    id: 'pipeline-manager',
    name: 'Pipeline Manager',
    role: 'Project lifecycle coordination, handoffs, progress tracking',
    reportsTo: 'ceo',
    team: 'leadership',
    tools: ['Notion MCP', 'Task tool', 'Read/Write', 'Bash'],
    responsibilities: [
      'Orchestrate projects through pipeline',
      'Coordinate handoffs between agents',
      'Track progress and blockers',
      'Manage parallel execution'
    ],
    color: '#10b981',
    icon: '🔄'
  },
  {
    id: 'autopilot-agent',
    name: 'Autopilot Agent',
    role: 'Autonomous checkpoint approval, overnight operations',
    reportsTo: 'pipeline-manager',
    team: 'leadership',
    tools: ['Read', 'Notion MCP', 'Bash', 'WebFetch'],
    responsibilities: [
      'Auto-approve low-risk checkpoints',
      'Escalate blockers and critical errors',
      'Generate morning summary reports',
      'Track costs and budget limits'
    ],
    color: '#f59e0b',
    icon: '🤖'
  },

  // VP Layer
  {
    id: 'vp-engineering',
    name: 'VP Engineering',
    role: 'Technical execution, code quality, infrastructure oversight',
    reportsTo: 'ceo',
    team: 'engineering',
    tools: ['Task tool', 'GitHub MCP', 'Supabase MCP', 'Read/Write'],
    responsibilities: [
      'Oversee all technical execution',
      'Coordinate engineering team',
      'Enforce technical standards',
      'Quality gate approvals'
    ],
    color: '#ef4444',
    icon: '⚙️'
  },
  {
    id: 'vp-product',
    name: 'VP Product',
    role: 'Product strategy, research, requirements, growth',
    reportsTo: 'ceo',
    team: 'product',
    tools: ['Task tool', 'Notion MCP', 'Perplexity MCP', 'WebSearch'],
    responsibilities: [
      'Product strategy alignment',
      'Research coordination',
      'Launch strategy oversight',
      'Success metrics definition'
    ],
    color: '#06b6d4',
    icon: '📊'
  },
  {
    id: 'vp-design',
    name: 'VP Design & QA',
    role: 'UX, visual design, quality assurance, documentation',
    reportsTo: 'ceo',
    team: 'design',
    tools: ['Task tool', 'Notion MCP', 'Figma MCP', 'Playwright MCP'],
    responsibilities: [
      'Design standards oversight',
      'QA coordination',
      'Documentation quality',
      'Release readiness sign-off'
    ],
    color: '#ec4899',
    icon: '🎨'
  },

  // Engineering Team
  {
    id: 'architect',
    name: 'Architect',
    role: 'Tech stack, system design, database schema, API design',
    reportsTo: 'vp-engineering',
    team: 'engineering',
    phase: 'Phase 3B',
    tools: ['GitHub MCP', 'Notion MCP', 'Read', 'WebSearch'],
    responsibilities: [
      'Tech stack selection',
      'System architecture design',
      'Database schema design',
      'API design and contracts'
    ],
    color: '#ef4444',
    icon: '🏗️'
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Build applications, implement features, deploy to preview',
    reportsTo: 'vp-engineering',
    team: 'engineering',
    phase: 'Phase 5A',
    tools: ['GitHub MCP', 'Supabase MCP', 'Netlify MCP', 'File tools', 'Bash'],
    responsibilities: [
      'Project setup and initialization',
      'Frontend and backend development',
      'Database implementation',
      'Deployment to preview'
    ],
    color: '#ef4444',
    icon: '💻'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    role: 'CI/CD, infrastructure, monitoring, deployment automation',
    reportsTo: 'vp-engineering',
    team: 'engineering',
    phase: 'Phase 9',
    tools: ['GitHub MCP', 'Netlify MCP', 'Supabase MCP', 'Bash', 'Security Scanner'],
    responsibilities: [
      'CI/CD pipeline setup',
      'Environment management',
      'Monitoring and alerts',
      'Production deployment'
    ],
    color: '#ef4444',
    icon: '🚀'
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    role: 'PR reviews, code quality, best practices enforcement',
    reportsTo: 'vp-engineering',
    team: 'engineering',
    phase: 'Phase 6B',
    tools: ['GitHub MCP', 'Read', 'Grep', 'Glob', 'Security Scanner'],
    responsibilities: [
      'PR code reviews',
      'Code quality enforcement',
      'Security issue detection',
      'Best practices guidance'
    ],
    color: '#ef4444',
    icon: '👀'
  },
  {
    id: 'security-engineer',
    name: 'Security Engineer',
    role: 'Vulnerability scanning, security audits, clearance',
    reportsTo: 'vp-engineering',
    team: 'engineering',
    phase: 'Phase 7',
    tools: ['Security Scanner', 'GitHub MCP', 'Bash', 'Read/Grep', 'Notion MCP'],
    responsibilities: [
      'Dependency audits',
      'Secret detection',
      'Code security analysis',
      'Security clearance sign-off'
    ],
    color: '#ef4444',
    icon: '🔒'
  },

  // Product Team
  {
    id: 'product-researcher',
    name: 'Product Researcher',
    role: 'Market research, competitor analysis, GO/NO-GO validation',
    reportsTo: 'vp-product',
    team: 'product',
    phase: 'Phase 2',
    tools: ['Perplexity MCP', 'Composio (Reddit)', 'WebSearch', 'WebFetch', 'Notion MCP'],
    responsibilities: [
      'Market research',
      'Competitor analysis',
      'User research',
      'Feasibility assessment'
    ],
    color: '#06b6d4',
    icon: '🔍'
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    role: 'Requirements, MVP scoping, user stories, success metrics',
    reportsTo: 'vp-product',
    team: 'product',
    phase: 'Phase 3A',
    tools: ['Notion MCP', 'Read'],
    responsibilities: [
      'Requirements definition',
      'MVP scope definition',
      'User story creation',
      'Success metrics'
    ],
    color: '#06b6d4',
    icon: '📝'
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    role: 'Analytics, data pipelines, dashboards, metrics tracking',
    reportsTo: 'vp-product',
    team: 'product',
    phase: 'Phase 5B',
    tools: ['Supabase MCP', 'Notion MCP', 'Bash', 'Read/Write'],
    responsibilities: [
      'Analytics schema setup',
      'Event tracking implementation',
      'Dashboard creation',
      'Metrics reporting'
    ],
    color: '#06b6d4',
    icon: '📈'
  },
  {
    id: 'growth-marketer',
    name: 'Growth Marketer',
    role: 'Landing pages, SEO, app store optimization, launch strategy',
    reportsTo: 'vp-product',
    team: 'product',
    phase: 'Phase 8B',
    tools: ['WebSearch', 'Perplexity MCP', 'Notion MCP', 'GitHub MCP', 'Netlify MCP'],
    responsibilities: [
      'Launch strategy planning',
      'Landing page creation',
      'SEO optimization',
      'Growth experiments'
    ],
    color: '#06b6d4',
    icon: '📣'
  },

  // Design & QA Team
  {
    id: 'frontend-designer',
    name: 'Frontend Designer',
    role: 'UI/UX design, mockups, design systems, component specs',
    reportsTo: 'vp-design',
    team: 'design',
    phase: 'Phase 4',
    tools: ['Notion MCP', 'WebSearch', 'Read/Write', 'Gemini MCP'],
    responsibilities: [
      'Design direction setting',
      'Visual mockup creation',
      'Design system definition',
      'Component specifications'
    ],
    color: '#ec4899',
    icon: '✨'
  },
  {
    id: 'user-testing',
    name: 'User Testing',
    role: 'E2E tests, cross-browser, accessibility, performance',
    reportsTo: 'vp-design',
    team: 'design',
    phase: 'Phase 6A',
    tools: ['Playwright MCP', 'Puppeteer MCP', 'Sentry MCP', 'Notion MCP', 'WebFetch'],
    responsibilities: [
      'E2E test execution',
      'Cross-browser testing',
      'Accessibility audits',
      'Performance testing'
    ],
    color: '#ec4899',
    icon: '🧪'
  },
  {
    id: 'technical-writer',
    name: 'Technical Writer',
    role: 'Documentation, README, user guides, handoff summaries',
    reportsTo: 'vp-design',
    team: 'design',
    phase: 'Phase 8A',
    tools: ['Notion MCP', 'GitHub MCP', 'Read'],
    responsibilities: [
      'README documentation',
      'User guide creation',
      'API documentation',
      'Handoff summary'
    ],
    color: '#ec4899',
    icon: '📚'
  },

  // Support
  {
    id: 'support-agent',
    name: 'Support Agent',
    role: 'User feedback, bug reports, FAQs, customer communication',
    reportsTo: 'chief-of-staff',
    team: 'support',
    tools: ['Notion MCP', 'GitHub MCP', 'Slack MCP', 'WebSearch', 'Read/Write'],
    responsibilities: [
      'Feedback processing',
      'Bug report logging',
      'FAQ management',
      'User communication'
    ],
    color: '#f59e0b',
    icon: '💬'
  }
];

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(a => a.id === id);
};

export const getChildAgents = (parentId: string): Agent[] => {
  return agents.filter(a => a.reportsTo === parentId);
};

export const getTeamColor = (team: Agent['team']): string => {
  const colors = {
    leadership: '#8b5cf6',
    engineering: '#ef4444',
    product: '#06b6d4',
    design: '#ec4899',
    support: '#f59e0b'
  };
  return colors[team];
};

export const teamNames: Record<Agent['team'], string> = {
  leadership: 'Leadership',
  engineering: 'VP Engineering Team',
  product: 'VP Product Team',
  design: 'VP Design & QA Team',
  support: 'Support'
};
