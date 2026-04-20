import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import type { WorkloadEntry } from "./mockData";
import { useTheme } from "./ThemeContext";

interface Props {
  data: WorkloadEntry[];
  avg: number;
  selectedAssignee: string | null;
  onSelect: (name: string) => void;
}

function getBarColor(tasks: number, avg: number, fullName: string, selected: string | null, isDark: boolean) {
  const isSelected = selected === fullName;
  const overloadThreshold = avg * 1.3;
  const underloadThreshold = avg * 0.75;

  if (isSelected) return "#FF910B";
  if (tasks >= overloadThreshold) return "#ef4444";
  if (tasks <= underloadThreshold) return isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)";
  return "#60a5fa";
}

const CustomTooltip = ({ active, payload, label, avg }: any) => {
  if (!active || !payload?.length) return null;
  const tasks = payload[0]?.value ?? 0;
  const overload = avg * 1.3;
  const underload = avg * 0.75;
  const status =
    tasks >= overload ? "Overloaded" : tasks <= underload ? "Underloaded" : "Balanced";
  const statusColor =
    tasks >= overload ? "#ef4444" : tasks <= underload ? "var(--dash-text-dim)" : "#22c55e";

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "var(--dash-elevated)",
        border: "1px solid var(--dash-border-strong)",
        fontSize: "0.72rem",
      }}
    >
      <p style={{ color: "var(--dash-text-primary)", fontWeight: 600, marginBottom: 6 }}>{label}</p>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-6">
          <span style={{ color: "var(--dash-text-dim)" }}>Tasks</span>
          <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>{tasks}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span style={{ color: "var(--dash-text-dim)" }}>Story Points</span>
          <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>
            {payload[0]?.payload?.points}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span style={{ color: "var(--dash-text-dim)" }}>vs avg</span>
          <span style={{ color: tasks > avg ? "#ef4444" : "#22c55e", fontWeight: 600 }}>
            {tasks > avg ? "+" : ""}
            {tasks - avg}
          </span>
        </div>
        <div
          className="mt-1 px-2 py-0.5 rounded self-start"
          style={{ background: `${statusColor}20`, color: statusColor, fontWeight: 600 }}
        >
          {status}
        </div>
      </div>
    </div>
  );
};

export const WorkloadChart = memo(function WorkloadChart({
  data,
  avg,
  selectedAssignee,
  onSelect,
}: Props) {
  const { isDark } = useTheme();
  const cursorFillColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const borderStrongColor = isDark ? "rgba(255,255,255,0.15)" : "#94a3b8";
  const barUnderloadColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)";

  const overloadThreshold = avg * 1.3;
  const underloadThreshold = avg * 0.75;

  const overloadedCount = data.filter((d) => d.tasks >= overloadThreshold).length;
  const underloadedCount = data.filter((d) => d.tasks <= underloadThreshold).length;

  return (
    <div
      className="rounded-xl flex flex-col p-[8px]"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(96,165,250,0.12)" }}
          >
            <Users size={14} style={{ color: "#60a5fa" }} />
          </div>
          <div>
            <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
              Workload Distribution
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>
              Tasks per assignee · avg {avg} tasks
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {overloadedCount > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(239,68,68,0.12)",
                color: "#ef4444",
                fontSize: "0.67rem",
                fontWeight: 600,
              }}
            >
              ↑ {overloadedCount} overloaded
            </div>
          )}
          {underloadedCount > 0 && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{
                background: "var(--dash-border)",
                color: "var(--dash-text-dim)",
                fontSize: "0.67rem",
                fontWeight: 600,
              }}
            >
              ↓ {underloadedCount} underloaded
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-shrink-0">
        {[
          { color: "#ef4444", label: `Overloaded (>${Math.round(overloadThreshold)} tasks)` },
          { color: "#60a5fa", label: "Balanced" },
          { color: barUnderloadColor, label: `Underloaded (<${Math.round(underloadThreshold)} tasks)` },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
            <span style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Chart — fills remaining height */}
      <div className="flex-1 min-h-0" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            barSize={32}
            onClick={(e) => {
              if (e?.activePayload?.[0]) {
                const fullName = e.activePayload[0].payload.fullName;
                onSelect(fullName);
              }
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--dash-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--dash-axis)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--dash-axis)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              content={<CustomTooltip avg={avg} />}
              cursor={{ fill: cursorFillColor }}
            />
            {/* Average reference line */}
            <ReferenceLine
              y={avg}
              stroke={borderStrongColor}
              strokeDasharray="4 4"
              label={{
                value: `avg ${avg}`,
                position: "insideTopRight",
                fill: "var(--dash-axis)",
                fontSize: 9,
              }}
            />
            {/* Overload threshold */}
            <ReferenceLine
              y={overloadThreshold}
              stroke="rgba(239,68,68,0.3)"
              strokeDasharray="3 3"
            />
            <Bar dataKey="tasks" radius={[4, 4, 0, 0]} cursor="pointer">
              {data.map((entry, index) => (
                <Cell
                  key={`wl-cell-${index}`}
                  fill={getBarColor(entry.tasks, avg, entry.fullName, selectedAssignee, isDark)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});