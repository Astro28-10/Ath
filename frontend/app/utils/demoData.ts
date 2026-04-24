/**
 * Demo Data for SkillBond Simulator
 * Realistic test scenarios for judges
 */

export const DEMO_SCENARIOS = {
  alice_bob: {
    name: 'Alice & Bob Project',
    description: 'Web Development Project - Freelancer with high reputation, client with medium reputation',
    client: {
      address: '0x72f32c9b10e8669b5fd139a00e03004ee4bd3b1d',
      name: 'Alice Johnson',
      reputation: 9500, // 95%
      rating: 4.9,
      projects: 156,
      bio: 'Experienced project manager, reliable client',
    },
    freelancer: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Bob Developer',
      reputation: 7200, // 72%
      rating: 4.3,
      projects: 42,
      bio: 'Full-stack developer with 3 years experience',
    },
    project: {
      title: 'Build React Dashboard',
      description: 'Create a responsive React dashboard with real-time data visualization',
      amount: '2', // 2 ETH
      durationDays: 14,
      skills: ['React', 'TypeScript', 'Recharts', 'API Integration'],
      category: 'Web Development',
    },
  },
  bob_carol: {
    name: 'Bob & Carol Project',
    description: 'Logo Design - Both parties building reputation',
    client: {
      address: '0x1234567890123456789012345678901234567890',
      name: 'Bob Developer',
      reputation: 7200, // 72%
      rating: 4.3,
      projects: 42,
      bio: 'Full-stack developer with 3 years experience',
    },
    freelancer: {
      address: '0x0987654321098765432109876543210987654321',
      name: 'Carol Designer',
      reputation: 4000, // 40%
      rating: 3.5,
      projects: 8,
      bio: 'Emerging graphic designer, building portfolio',
    },
    project: {
      title: 'Design Company Logo',
      description: 'Create a modern, minimalist logo for tech startup',
      amount: '0.5', // 0.5 ETH
      durationDays: 7,
      skills: ['Graphic Design', 'Figma', 'Brand Design'],
      category: 'Design',
    },
  },
  carol_dave: {
    name: 'Carol & Dave Project',
    description: 'Content Writing - Both new to platform',
    client: {
      address: '0x0987654321098765432109876543210987654321',
      name: 'Carol Designer',
      reputation: 4000, // 40%
      rating: 3.5,
      projects: 8,
      bio: 'Emerging graphic designer, building portfolio',
    },
    freelancer: {
      address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      name: 'Dave Writer',
      reputation: 3500, // 35%
      rating: 4.1,
      projects: 5,
      bio: 'Technical writer and content strategist',
    },
    project: {
      title: 'Write 20 Blog Posts',
      description: 'SEO-optimized technical blog posts for SaaS company',
      amount: '1.5', // 1.5 ETH
      durationDays: 30,
      skills: ['Content Writing', 'SEO', 'Technical Writing'],
      category: 'Writing',
    },
  },
};

export const getScenarioById = (id: keyof typeof DEMO_SCENARIOS) => {
  return DEMO_SCENARIOS[id] || null;
};

export const getAllScenarios = () => {
  return Object.entries(DEMO_SCENARIOS).map(([id, data]) => ({
    id,
    ...data,
  }));
};

// Helper to format address for display
export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper to get reputation color
export const getReputationColor = (reputation: number): string => {
  const percent = (reputation / 10000) * 100;
  if (percent >= 80) return 'text-green-600';
  if (percent >= 60) return 'text-blue-600';
  if (percent >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

// Helper to get reputation label
export const getReputationLabel = (reputation: number): string => {
  const percent = (reputation / 10000) * 100;
  if (percent >= 80) return 'Excellent';
  if (percent >= 60) return 'Good';
  if (percent >= 40) return 'Fair';
  return 'New';
};
