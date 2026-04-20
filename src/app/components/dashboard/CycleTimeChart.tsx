import { Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTheme } from "./ThemeContext";

interface CycleTimeData {
  day: string;
  actual: number;
  target: number;
}

interface Props {
  data: CycleTimeData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3"
        style={{ background: "var(--dash-elevated)", border: "1px solid var(--dash-border-strong)", fontSize: "0.72rem" }}
      >
        <p style={{ color: "var(--dash-text-muted)", marginBottom: 6 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: "var(--dash-text-secondary)" }}>{p.name}:</span>
            <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>{p.value} days</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CycleTimeChart({ data }: Props) {
  const { isDark } = useTheme();
  const borderStrongColor = isDark ? "rgba(255,255,255,0.15)" : "#94a3b8";
  const cursorStrokeColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <div
      className="rounded-xl p-[8px]"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,145,11,0.12)" }}>
            <Clock size={14} style={{ color: "#FF910B" }} />
          </div>
          <div>
            <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
              Cycle Time
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>Days per task · Sprint 24</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: "#FF910B" }} />
            <span style={{ fontSize: "0.65rem", color: "var(--dash-text-dim)" }}>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: "var(--dash-border-strong)" }} />
            <span style={{ fontSize: "0.65rem", color: "var(--dash-text-dim)" }}>Target</span>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 230 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-grid)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "var(--dash-axis)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--dash-axis)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={28}
              domain={[0, 5]}
              tickFormatter={(v) => `${v}d`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorStrokeColor }} />
            <Line
              type="monotone"
              dataKey="target"
              stroke={borderStrongColor}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name="Target"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FF910B"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, key } = props;
                return (
                  <circle key={key} cx={cx} cy={cy} r={3} fill="#FF910B" strokeWidth={0} />
                );
              }}
              activeDot={(props: any) => {
                const { cx, cy, key } = props;
                return (
                  <circle key={key} cx={cx} cy={cy} r={5} fill="#FF910B" stroke="rgba(255,145,11,0.3)" strokeWidth={4} />
                );
              }}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}