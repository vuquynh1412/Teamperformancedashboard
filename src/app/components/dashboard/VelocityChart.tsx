import { memo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { VelocityEntry } from "./mockData";
import { useTheme } from "./ThemeContext";

interface Props {
  data: VelocityEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const points = payload.find((p: any) => p.dataKey === "points")?.value ?? 0;
  const target = payload.find((p: any) => p.dataKey === "target")?.value ?? 0;
  const delta = points - target;

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "var(--dash-elevated)",
        border: "1px solid var(--dash-border-strong)",
        fontSize: "0.72rem",
      }}
    >
      <p style={{ color: "var(--dash-text-muted)", marginBottom: 6 }}>{label}</p>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-6">
          <span style={{ color: "var(--dash-text-dim)" }}>Velocity</span>
          <span style={{ color: "#FF910B", fontWeight: 700 }}>{points} pts</span>
        </div>
        <div className="flex justify-between gap-6">
          <span style={{ color: "var(--dash-text-dim)" }}>Target</span>
          <span style={{ color: "var(--dash-text-dim)" }}>{target} pts</span>
        </div>
        <div
          className="flex justify-between gap-6 mt-1 pt-1"
          style={{ borderTop: "1px solid var(--dash-border)" }}
        >
          <span style={{ color: "var(--dash-text-dim)" }}>vs Target</span>
          <span style={{ color: delta >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
            {delta >= 0 ? "+" : ""}{delta} pts
          </span>
        </div>
      </div>
    </div>
  );
};

export const VelocityChart = memo(function VelocityChart({ data }: Props) {
  const { isDark } = useTheme();
  const cursorFillColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const borderStrongColor = isDark ? "rgba(255,255,255,0.15)" : "#94a3b8";

  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const trend = last.points - prev.points;
  const avg = Math.round(data.reduce((s, d) => s + d.points, 0) / data.length);

  // Duplicate 'points' into 'pointsLine' so Bar and Line never share the same
  // dataKey — Recharts uses dataKey as an internal series identifier and having
  // two series with identical dataKeys generates duplicate-key React warnings.
  const chartData = data.map((d) => ({ ...d, pointsLine: d.points }));

  return (
    <div
      className="rounded-xl h-full p-[8px]"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,145,11,0.12)" }}
          >
            <TrendingUp size={14} style={{ color: "#FF910B" }} />
          </div>
          <div>
            <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
              Velocity Trend
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>
              Story points · avg {avg} pts/sprint
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(255,145,11,0.1)",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#FF910B",
            }}
          >
            {last.points} pts
          </div>
          <div
            className="px-2 py-1 rounded-lg"
            style={{
              background: trend >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              fontSize: "0.68rem",
              fontWeight: 600,
              color: trend >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={28}>
            <defs>
              <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#FF910B" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#FF910B" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-grid)" vertical={false} />
            <XAxis
              dataKey="sprint"
              tick={{ fill: "var(--dash-axis)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--dash-axis)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={28}
              domain={[50, 95]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFillColor }} />
            <ReferenceLine
              y={last.target}
              stroke={borderStrongColor}
              strokeDasharray="4 4"
              label={{
                value: `target ${last.target}`,
                position: "insideTopRight",
                fill: "var(--dash-axis)",
                fontSize: 9,
              }}
            />
            <Bar dataKey="points" radius={[4, 4, 0, 0]} fill="url(#velGrad)">
              {data.map((entry, index) => (
                <Cell
                  key={`vel-cell-${index}`}
                  fill={
                    index === data.length - 1
                      ? "#FF910B"
                      : entry.points >= entry.target
                      ? "rgba(255,145,11,0.55)"
                      : "rgba(239,68,68,0.5)"
                  }
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="pointsLine"
              stroke="#FF910B"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, key } = props;
                return <circle key={key} cx={cx} cy={cy} r={3} fill="#FF910B" strokeWidth={0} />;
              }}
              activeDot={(props: any) => {
                const { cx, cy, key } = props;
                return <circle key={key} cx={cx} cy={cy} r={5} fill="#FF910B" stroke="rgba(255,145,11,0.3)" strokeWidth={4} />;
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});