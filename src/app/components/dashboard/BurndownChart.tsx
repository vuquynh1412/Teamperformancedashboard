import { Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "./ThemeContext";

interface BurndownData {
  day: string;
  remaining: number;
  ideal: number;
}

interface Props {
  data: BurndownData[];
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
            <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>{p.value} pts</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BurndownChart({ data }: Props) {
  const { isDark } = useTheme();
  const borderStrongColor = isDark ? "rgba(255,255,255,0.15)" : "#94a3b8";
  const cursorStrokeColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const lastPoint = data[data.length - 1];
  const isBehind = lastPoint.remaining > lastPoint.ideal;

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
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--dash-subtle)" }}>
            <Activity size={14} style={{ color: "var(--dash-text-muted)" }} />
          </div>
          <div>
            <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
              Burndown
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>Story points remaining</p>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-md"
          style={{
            background: isBehind ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.12)",
            color: isBehind ? "#eab308" : "#22c55e",
            fontSize: "0.68rem",
            fontWeight: 600,
          }}
        >
          {isBehind ? `↑ ${lastPoint.remaining - lastPoint.ideal} pts behind` : "On schedule"}
        </span>
      </div>

      <div style={{ width: "100%", height: 230 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={borderStrongColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={borderStrongColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="remainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="rgba(255,145,11,0.3)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgba(255,145,11,0.3)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorStrokeColor }} />
            <Area
              type="monotone"
              dataKey="ideal"
              stroke={borderStrongColor}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#idealGrad)"
              name="Ideal"
            />
            <Area
              type="monotone"
              dataKey="remaining"
              stroke="#FF910B"
              strokeWidth={2.5}
              fill="url(#remainGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#FF910B", stroke: "rgba(255,145,11,0.3)", strokeWidth: 4 }}
              name="Remaining"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}