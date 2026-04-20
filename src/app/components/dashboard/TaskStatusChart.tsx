import { LayoutGrid } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { StatusSnapshot } from "./mockData";
import { useTheme } from "./ThemeContext";

interface Props {
  data: StatusSnapshot[];
}

export const STAGE_CONFIG = [
  { key: "todo",       label: "Todo",        color: "#64748b" },
  { key: "inProgress", label: "In Progress", color: "#FF910B" },
  { key: "review",     label: "Review",      color: "#eab308" },
  { key: "test",       label: "Test",        color: "#60a5fa" },
  { key: "testFailed", label: "Test Failed", color: "#ef4444" },
  { key: "testPassed", label: "Test Passed", color: "#22c55e" },
  { key: "deployed",   label: "Deployed",    color: "#a78bfa" },
  { key: "done",       label: "Done",        color: "#10b981" },
] as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const map: Record<string, number> = {};
  payload.forEach((p: any) => { map[p.dataKey] = p.value; });

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "var(--dash-elevated)",
        border: "1px solid var(--dash-border-strong)",
        fontSize: "0.72rem",
        minWidth: 160,
      }}
    >
      <p style={{ color: "var(--dash-text-muted)", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {STAGE_CONFIG.slice().reverse().map((s) => {
        const val = map[s.key];
        if (!val) return null;
        return (
          <div key={s.key} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span style={{ color: "var(--dash-text-secondary)" }}>{s.label}</span>
            </div>
            <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>{val}</span>
          </div>
        );
      })}
    </div>
  );
};

export function TaskStatusChart({ data }: Props) {
  const { isDark } = useTheme();
  const cursorFillColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";

  return (
    <div
      className="rounded-xl flex flex-col h-full p-[8px]"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(255,145,11,0.12)" }}
        >
          <LayoutGrid size={14} style={{ color: "#FF910B" }} />
        </div>
        <div>
          <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
            Task Status
          </h3>
          <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>Distribution over sprint</p>
        </div>
      </div>

      {/* Legend — 2 rows of 4 */}
      <div className="grid grid-cols-4 gap-x-2 gap-y-1.5 mb-5 flex-shrink-0">
        {STAGE_CONFIG.map((s) => (
          <div key={s.key} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span style={{ fontSize: "0.58rem", color: "var(--dash-text-dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart — fills remaining height */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={9}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-grid)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "var(--dash-axis)", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--dash-axis)", fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFillColor }} />

            {STAGE_CONFIG.map((s, i) => (
              <Bar
                key={`bar-${s.key}`}
                dataKey={s.key}
                stackId="a"
                fill={s.color}
                name={s.label}
                radius={i === STAGE_CONFIG.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}