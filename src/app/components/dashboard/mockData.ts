export interface KPIs {
  output: number;
  reliability: number;
  speed: number;
  quality: number;
  flow: number;
}

export interface BottleneckRow {
  stage: string;
  avgTime: string;
  avgDays: number;
  status: "ok" | "warning" | "critical";
}

export interface InsightItem {
  type: "critical" | "warning" | "info";
  text: string;
}

export interface StatusSnapshot {
  week: string;
  todo: number;
  inProgress: number;
  review: number;
  test: number;
  testFailed: number;
  testPassed: number;
  deployed: number;
  done: number;
}

export interface DashboardData {
  teamScore: number;
  sprint: { name: string; dates: string; project: string };
  kpis: KPIs;
  charts: {
    cycleTime: Array<{ day: string; actual: number; target: number }>;
    burndown: Array<{ day: string; remaining: number; ideal: number }>;
    quality: Array<{ name: string; value: number; color: string }>;
    status: StatusSnapshot[];
  };
  bottlenecks: BottleneckRow[];
  insights: InsightItem[];
}

export const dashboardData: DashboardData = {
  teamScore: 78,
  sprint: {
    name: "Sprint 24",
    dates: "Apr 7 – Apr 18, 2026",
    project: "Phoenix Platform",
  },
  kpis: {
    output: 82,
    reliability: 75,
    speed: 68,
    quality: 84,
    flow: 71,
  },
  charts: {
    cycleTime: [
      { day: "Apr 7",  actual: 3.2, target: 2.5 },
      { day: "Apr 8",  actual: 2.8, target: 2.5 },
      { day: "Apr 9",  actual: 3.5, target: 2.5 },
      { day: "Apr 10", actual: 2.1, target: 2.5 },
      { day: "Apr 11", actual: 1.9, target: 2.5 },
      { day: "Apr 14", actual: 2.4, target: 2.5 },
      { day: "Apr 15", actual: 2.2, target: 2.5 },
      { day: "Apr 16", actual: 2.7, target: 2.5 },
      { day: "Apr 17", actual: 3.1, target: 2.5 },
      { day: "Apr 18", actual: 2.6, target: 2.5 },
    ],
    burndown: [
      { day: "Apr 7",  remaining: 120, ideal: 120 },
      { day: "Apr 8",  remaining: 110, ideal: 107 },
      { day: "Apr 9",  remaining: 98,  ideal: 93  },
      { day: "Apr 10", remaining: 92,  ideal: 80  },
      { day: "Apr 11", remaining: 88,  ideal: 67  },
      { day: "Apr 14", remaining: 71,  ideal: 53  },
      { day: "Apr 15", remaining: 58,  ideal: 40  },
      { day: "Apr 16", remaining: 45,  ideal: 27  },
      { day: "Apr 17", remaining: 32,  ideal: 13  },
      { day: "Apr 18", remaining: 28,  ideal: 0   },
    ],
    quality: [
      { name: "Pass",   value: 84, color: "#22c55e" },
      { name: "Rework", value: 11, color: "#eab308" },
      { name: "Failed", value: 5,  color: "#ef4444" },
    ],
    // total tasks = 105 across all stages per snapshot
    status: [
      { week: "W1 Mon", todo: 45, inProgress: 15, review: 8,  test: 8,  testFailed: 4, testPassed: 3,  deployed: 2,  done: 2  },
      { week: "W1 Wed", todo: 36, inProgress: 18, review: 10, test: 9,  testFailed: 3, testPassed: 5,  deployed: 3,  done: 5  },
      { week: "W1 Fri", todo: 26, inProgress: 20, review: 12, test: 10, testFailed: 4, testPassed: 6,  deployed: 5,  done: 12 },
      { week: "W2 Mon", todo: 18, inProgress: 22, review: 10, test: 8,  testFailed: 3, testPassed: 8,  deployed: 7,  done: 22 },
      { week: "W2 Wed", todo: 10, inProgress: 16, review: 8,  test: 7,  testFailed: 2, testPassed: 9,  deployed: 10, done: 36 },
      { week: "W2 Fri", todo: 4,  inProgress: 8,  review: 5,  test: 4,  testFailed: 1, testPassed: 5,  deployed: 12, done: 58 },
    ],
  },
  bottlenecks: [
    { stage: "Todo",        avgTime: "0.5 days", avgDays: 0.5, status: "ok"       },
    { stage: "In Progress", avgTime: "3.8 days", avgDays: 3.8, status: "warning"  },
    { stage: "Review",      avgTime: "2.1 days", avgDays: 2.1, status: "warning"  },
    { stage: "Test",        avgTime: "5.4 days", avgDays: 5.4, status: "critical" },
    { stage: "Test Failed", avgTime: "1.8 days", avgDays: 1.8, status: "warning"  },
    { stage: "Test Passed", avgTime: "0.4 days", avgDays: 0.4, status: "ok"       },
    { stage: "Deployed",    avgTime: "0.3 days", avgDays: 0.3, status: "ok"       },
    { stage: "Done",        avgTime: "0.1 days", avgDays: 0.1, status: "ok"       },
  ],
  insights: [
    {
      type: "critical",
      text: "Test stage is the primary bottleneck — averaging 5.4 days per task, 2.2× above target.",
    },
    {
      type: "warning",
      text: "Test Failed rate at 8%. Review stories stuck in failed state — consider pairing with QA.",
    },
    {
      type: "info",
      text: "Output is stable at 82 — team velocity maintained despite testing delays.",
    },
  ],
};

export const projects = ["Phoenix Platform", "Atlas Core", "Nova Dashboard", "Helix API"];
export const sprints  = ["Sprint 24", "Sprint 23", "Sprint 22", "Sprint 21"];

// ─── Extended Analytics Data ───────────────────────────────────────────────

export interface TeamMember {
  id: number;
  name: string;
  initials: string;
  role: string;
  tasksCompleted: number;
  avgCycleTime: number;
  efficiencyScore: number;
}

export interface EpicRow {
  id: number;
  name: string;
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  test: number;
  testFailed: number;
  testPassed: number;
  deployed: number;
  done: number;
}

export interface WorkloadEntry {
  name: string;
  fullName: string;
  tasks: number;
  points: number;
}

export interface TaskTypeEntry {
  name: string;
  count: number;
  value: number;
  color: string;
}

export interface VelocityEntry {
  sprint: string;
  points: number;
  target: number;
}

export interface CycleTimeBucket {
  range: string;
  count: number;
  cumulative: number;
}

export interface CFDEntry {
  date: string;
  todo: number;
  inProgress: number;
  review: number;
  test: number;
  testFailed: number;
  testPassed: number;
  deployed: number;
  done: number;
}

// Raw team members
const rawMembers = [
  { id: 1, name: "Alex Chen",    initials: "AC", role: "Frontend Lead",  tasksCompleted: 18, avgCycleTime: 1.8 },
  { id: 2, name: "Carlos Ménd.", initials: "CM", role: "Full-Stack",      tasksCompleted: 15, avgCycleTime: 2.0 },
  { id: 3, name: "Jordan Lee",   initials: "JL", role: "Backend",         tasksCompleted: 14, avgCycleTime: 2.1 },
  { id: 4, name: "Sam Rivera",   initials: "SR", role: "Backend",         tasksCompleted: 16, avgCycleTime: 2.4 },
  { id: 5, name: "Maya Patel",   initials: "MP", role: "QA Engineer",     tasksCompleted: 12, avgCycleTime: 1.9 },
  { id: 6, name: "Tom Walsh",    initials: "TW", role: "DevOps",          tasksCompleted: 10, avgCycleTime: 3.2 },
  { id: 7, name: "Nina Kos",     initials: "NK", role: "Designer",        tasksCompleted:  8, avgCycleTime: 2.8 },
];

const rawEfficiencies = rawMembers.map((m) => m.tasksCompleted / m.avgCycleTime);
const maxEff = Math.max(...rawEfficiencies);

export const teamMembers: TeamMember[] = rawMembers
  .map((m, i) => ({ ...m, efficiencyScore: Math.round((rawEfficiencies[i] / maxEff) * 100) }))
  .sort((a, b) => b.efficiencyScore - a.efficiencyScore);

export const epics: EpicRow[] = [
  { id: 1, name: "Auth & Security",   total: 24, todo: 1, inProgress: 2, review: 2, test: 2, testFailed: 1, testPassed: 2, deployed: 2, done: 12 },
  { id: 2, name: "Dashboard UI",      total: 18, todo: 1, inProgress: 2, review: 2, test: 2, testFailed: 1, testPassed: 2, deployed: 1, done:  7 },
  { id: 3, name: "API Integration",   total: 32, todo: 4, inProgress: 4, review: 4, test: 4, testFailed: 2, testPassed: 3, deployed: 2, done:  9 },
  { id: 4, name: "Performance Opt.",  total: 12, todo: 2, inProgress: 2, review: 1, test: 1, testFailed: 1, testPassed: 1, deployed: 1, done:  3 },
  { id: 5, name: "Mobile Responsive", total: 20, todo: 4, inProgress: 4, review: 3, test: 3, testFailed: 2, testPassed: 2, deployed: 1, done:  1 },
];

export const workloadData: WorkloadEntry[] = [
  { name: "Alex",   fullName: "Alex Chen",    tasks: 18, points: 42 },
  { name: "Sam",    fullName: "Sam Rivera",   tasks: 16, points: 37 },
  { name: "Carlos", fullName: "Carlos Ménd.", tasks: 15, points: 35 },
  { name: "Jordan", fullName: "Jordan Lee",   tasks: 14, points: 31 },
  { name: "Maya",   fullName: "Maya Patel",   tasks: 12, points: 28 },
  { name: "Tom",    fullName: "Tom Walsh",    tasks: 10, points: 22 },
  { name: "Nina",   fullName: "Nina Kos",     tasks:  8, points: 18 },
];

const totalTaskCount = workloadData.reduce((s, d) => s + d.tasks, 0);
export const avgWorkload = Math.round(totalTaskCount / workloadData.length);

export const taskTypeData: TaskTypeEntry[] = (() => {
  const raw = [
    { name: "Story",  count: 42, color: "#22c55e" },
    { name: "Task",   count: 31, color: "#60a5fa" },
    { name: "Bug",    count: 18, color: "#ef4444" },
    { name: "Hotfix", count:  9, color: "#FF910B" },
  ];
  const total = raw.reduce((s, r) => s + r.count, 0);
  return raw.map((r) => ({ ...r, value: Math.round((r.count / total) * 100) }));
})();

export const velocityData: VelocityEntry[] = [
  { sprint: "S20", points: 68, target: 75 },
  { sprint: "S21", points: 74, target: 75 },
  { sprint: "S22", points: 71, target: 75 },
  { sprint: "S23", points: 82, target: 75 },
  { sprint: "S24", points: 78, target: 75 },
];

export const cycleTimeDistribution: CycleTimeBucket[] = [
  { range: "0–1d", count: 12, cumulative: 12 },
  { range: "1–2d", count: 28, cumulative: 40 },
  { range: "2–3d", count: 22, cumulative: 62 },
  { range: "3–4d", count: 15, cumulative: 77 },
  { range: "4–5d", count:  8, cumulative: 85 },
  { range: "5–6d", count:  5, cumulative: 90 },
  { range: "6d+",  count:  3, cumulative: 93 },
];

// total tasks = 105 per row across all stages
export const cfdData: CFDEntry[] = [
  { date: "Apr 7",  todo: 60, inProgress: 18, review: 8,  test: 8,  testFailed: 5, testPassed: 4,  deployed: 3,  done: 2  },
  { date: "Apr 8",  todo: 52, inProgress: 20, review: 9,  test: 9,  testFailed: 4, testPassed: 3,  deployed: 3,  done: 5  },
  { date: "Apr 9",  todo: 45, inProgress: 22, review: 10, test: 9,  testFailed: 3, testPassed: 4,  deployed: 4,  done: 8  },
  { date: "Apr 10", todo: 38, inProgress: 22, review: 10, test: 10, testFailed: 4, testPassed: 5,  deployed: 5,  done: 11 },
  { date: "Apr 11", todo: 32, inProgress: 24, review: 9,  test: 10, testFailed: 4, testPassed: 5,  deployed: 6,  done: 15 },
  { date: "Apr 14", todo: 25, inProgress: 23, review: 10, test: 10, testFailed: 3, testPassed: 6,  deployed: 8,  done: 20 },
  { date: "Apr 15", todo: 18, inProgress: 22, review: 9,  test: 9,  testFailed: 3, testPassed: 7,  deployed: 9,  done: 28 },
  { date: "Apr 16", todo: 12, inProgress: 20, review: 8,  test: 8,  testFailed: 2, testPassed: 6,  deployed: 10, done: 39 },
  { date: "Apr 17", todo:  7, inProgress: 16, review: 7,  test: 7,  testFailed: 2, testPassed: 5,  deployed: 10, done: 51 },
  { date: "Apr 18", todo:  3, inProgress: 10, review: 5,  test: 5,  testFailed: 1, testPassed: 4,  deployed: 10, done: 67 },
];
