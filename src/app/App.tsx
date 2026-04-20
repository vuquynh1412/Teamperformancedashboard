import { useState, useCallback } from "react";
import {
  ThemeProvider,
  useTheme,
} from "./components/dashboard/ThemeContext";
import { Header } from "./components/dashboard/Header";
import { TeamScore } from "./components/dashboard/TeamScore";
import {
  KPICard,
  kpiConfig,
} from "./components/dashboard/KPICard";
import { CycleTimeChart } from "./components/dashboard/CycleTimeChart";
import { BurndownChart } from "./components/dashboard/BurndownChart";
import { QualityDonut } from "./components/dashboard/QualityDonut";
import { TaskStatusChart } from "./components/dashboard/TaskStatusChart";
import { BottleneckTable } from "./components/dashboard/BottleneckTable";
import { TeamRankingCard } from "./components/dashboard/TeamRankingCard";
import { WorkloadChart } from "./components/dashboard/WorkloadChart";
import { TaskTypeDonut } from "./components/dashboard/TaskTypeDonut";
import { VelocityChart } from "./components/dashboard/VelocityChart";
import { EpicTable } from "./components/dashboard/EpicTable";
import { CFDiagram } from "./components/dashboard/CFDiagram";
import { SectionDivider } from "./components/dashboard/SectionDivider";
import {
  dashboardData,
  projects,
  sprints,
  teamMembers,
  epics,
  workloadData,
  avgWorkload,
  taskTypeData,
  velocityData,
  cfdData,
} from "./components/dashboard/mockData";

// ── Filter pill ─────────────────────────────────────────────────────────────────
function FilterPill({
  label,
  value,
  color = "#FF910B",
  onClear,
}: {
  label: string;
  value: string;
  color?: string;
  onClear: () => void;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}35`,
        fontSize: "0.72rem",
        color,
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
      />
      <span>
        {label}: <strong>{value}</strong>
      </span>
      <button
        onClick={onClear}
        className="ml-1 hover:opacity-70 transition-opacity"
        style={{ fontSize: "1rem", lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
function DashboardApp() {
  const { isDark } = useTheme();
  const [selectedProject, setSelectedProject] = useState(
    projects[0],
  );
  const [selectedSprint, setSelectedSprint] = useState(
    sprints[0],
  );
  const [selectedKPI, setSelectedKPI] = useState<string | null>(
    null,
  );
  const [selectedAssignee, setSelectedAssignee] = useState<
    string | null
  >(null);
  const [selectedEpic, setSelectedEpic] = useState<
    string | null
  >(null);

  const lowestKPI = kpiConfig.reduce((min, item) =>
    item.score < min.score ? item : min,
  );

  const handleKPIClick = useCallback((key: string) => {
    setSelectedKPI((prev) => (prev === key ? null : key));
  }, []);

  const handleAssigneeClick = useCallback((name: string) => {
    setSelectedAssignee((prev) =>
      prev === name ? null : name,
    );
  }, []);

  const handleEpicClick = useCallback((name: string) => {
    setSelectedEpic((prev) => (prev === name ? null : name));
  }, []);

  const hasFilters =
    selectedKPI || selectedAssignee || selectedEpic;

  return (
    <div
      className={`${isDark ? "" : "light"} min-h-screen`}
      style={{
        background: "var(--dash-bg)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Page wrapper: 1440px max, responsive padding ── */}
      <div
        className="mx-auto py-4"
        style={{
          maxWidth: 1440,
          paddingLeft: "clamp(12px, 3vw, 24px)",
          paddingRight: "clamp(12px, 3vw, 24px)",
        }}
      >
        {/* ════════════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════════════ */}
        <Header
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedSprint={selectedSprint}
          setSelectedSprint={setSelectedSprint}
          sprint={dashboardData.sprint}
        />

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {selectedKPI && (
              <FilterPill
                label="KPI"
                value={
                  kpiConfig.find((k) => k.key === selectedKPI)
                    ?.label ?? ""
                }
                onClear={() => setSelectedKPI(null)}
              />
            )}
            {selectedAssignee && (
              <FilterPill
                label="Assignee"
                value={selectedAssignee}
                color="#60a5fa"
                onClear={() => setSelectedAssignee(null)}
              />
            )}
            {selectedEpic && (
              <FilterPill
                label="Epic"
                value={selectedEpic}
                color="#a78bfa"
                onClear={() => setSelectedEpic(null)}
              />
            )}
            <button
              onClick={() => {
                setSelectedKPI(null);
                setSelectedAssignee(null);
                setSelectedEpic(null);
              }}
              className="px-3 py-1.5 rounded-full hover:opacity-70 transition-opacity"
              style={{
                background: "var(--dash-subtle)",
                border: "1px solid var(--dash-border)",
                fontSize: "0.68rem",
                color: "var(--dash-text-dim)",
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            SECTION 1 — HERO AREA
            TeamScore (3 col) + 5 KPI cards (9 col)
        ══════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">
          {/* Team Score — always full-width hero row on top */}
          <TeamScore score={dashboardData.teamScore} />

          {/* KPI summary cards — always below, wrap as screen scales */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpiConfig.map((item) => (
              <KPICard
                key={item.key}
                item={item}
                isLowest={item.key === lowestKPI.key}
                isSelected={selectedKPI === item.key}
                onClick={handleKPIClick}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 2 — MAIN ANALYTICS
            Left 8 col: Cycle Time + Burndown (trend charts)
            Right 4 col: Quality + Task Status (distribution)
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mx-[0px] my-[16px]">
          {/* Left: trend charts */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <CycleTimeChart
              data={dashboardData.charts.cycleTime}
            />
            <BurndownChart
              data={dashboardData.charts.burndown}
            />
          </div>

          {/* Right: distribution charts */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex-shrink-0">
              <QualityDonut
                data={dashboardData.charts.quality}
              />
            </div>
            <div className="flex-1 min-h-0">
              <TaskStatusChart
                data={dashboardData.charts.status}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 3 — PIPELINE BOTTLENECKS (full width)
        ══════════════════════════════════════════════════ */}
        <div className="">
          <BottleneckTable data={dashboardData.bottlenecks} />
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 4 — TEAM ANALYTICS
            Left 7 col: Top Performers
            Right 5 col: Workload Distribution
        ══════════════════════════════════════════════════ */}
        <SectionDivider
          title="Team Analytics"
          subtitle="Member performance · workload balance"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:items-stretch">
          {/* Top Performers ranking */}
          <div className="lg:col-span-7 flex flex-col">
            <TeamRankingCard
              members={teamMembers}
              selectedAssignee={selectedAssignee}
              onSelect={handleAssigneeClick}
            />
          </div>

          {/* Workload Distribution — flex col so WorkloadChart can fill height */}
          <div className="lg:col-span-5 flex flex-col">
            <WorkloadChart
              data={workloadData}
              avg={avgWorkload}
              selectedAssignee={selectedAssignee}
              onSelect={handleAssigneeClick}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 5 — VELOCITY + TASK TYPE
            Left 8 col: Velocity Trend (core trend)
            Right 4 col: Task Type Breakdown (compact donut)
        ══════════════════════════════════════════════════ */}
        <SectionDivider
          title="Velocity & Breakdown"
          subtitle="Sprint throughput · task category distribution"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 ">
          {/* Velocity Trend — visually dominant */}
          <div className="lg:col-span-8">
            <VelocityChart data={velocityData} />
          </div>

          {/* Task Type Breakdown — compact donut */}
          <div className="lg:col-span-4">
            <TaskTypeDonut data={taskTypeData} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 6 — EPIC BREAKDOWN (full width)
        ══════════════════════════════════════════════════ */}
        <SectionDivider
          title="Epic Breakdown"
          subtitle="Task status distribution per epic"
        />

        <div className="">
          <EpicTable
            epics={epics}
            selectedEpic={selectedEpic}
            onSelect={handleEpicClick}
          />
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 7 — CUMULATIVE FLOW (full width, bottom)
        ══════════════════════════════════════════════════ */}
        <SectionDivider
          title="Cumulative Flow Diagram"
          subtitle="Bottleneck detection via WIP band analysis"
        />

        <div className="p-[0px]">
          <CFDiagram data={cfdData} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardApp />
    </ThemeProvider>
  );
}