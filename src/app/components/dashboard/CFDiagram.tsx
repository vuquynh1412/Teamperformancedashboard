import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GitBranch } from "lucide-react";
import type { CFDEntry } from "./mockData";
import { useTheme } from "./ThemeContext";

interface Props {
  data: CFDEntry[];
}

// Ordered bottom → top in stacked area (done at bottom, todo at top)
const CFD_LAYERS = [
  { key: "done",       label: "Done",        color: "#10b981", gradId: "cfdDone"       },
  { key: "deployed",   label: "Deployed",    color: "#a78bfa", gradId: "cfdDeployed"   },
  { key: "testPassed", label: "Test Passed", color: "#22c55e", gradId: "cfdTestPassed" },
  { key: "testFailed", label: "Test Failed", color: "#ef4444", gradId: "cfdTestFailed" },
  { key: "test",       label: "Test",        color: "#60a5fa", gradId: "cfdTest"       },
  { key: "review",     label: "Review",      color: "#eab308", gradId: "cfdReview"     },
  { key: "inProgress", label: "In Progress", color: "#FF910B", gradId: "cfdWIP"        },
  { key: "todo",       label: "Todo",        color: "#64748b", gradId: "cfdTodo"       },
] as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const map: Record<string, number> = {};
  payload.forEach((p: any) => { map[p.dataKey] = p.value; });
  const total = Object.values(map).reduce((a, b) => a + b, 0);

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "var(--dash-elevated)",
        border: "1px solid var(--dash-border-strong)",
        fontSize: "0.72rem",
        minWidth: 200,
      }}
    >
      <p style={{ color: "var(--dash-text-muted)", marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {[...CFD_LAYERS].reverse().map((layer) => {
        const val = map[layer.key] ?? 0;
        if (!val) return null;
        return (
          <div key={layer.key} className="flex items-center justify-between gap-4 mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: layer.color }} />
              <span style={{ color: "var(--dash-text-secondary)" }}>{layer.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>{val}</span>
              <span style={{ color: "var(--dash-text-dim)" }}>
                ({Math.round((val / total) * 100)}%)
              </span>
            </div>
          </div>
        );
      })}
      <div
        className="flex justify-between mt-2 pt-2"
        style={{ borderTop: "1px solid var(--dash-border)" }}
      >
        <span style={{ color: "var(--dash-text-dim)" }}>Total in flight</span>
        <span style={{ color: "#FF910B", fontWeight: 700 }}>{total}</span>
      </div>
    </div>
  );
};

const CustomLegend = () => (
  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
    {[...CFD_LAYERS].reverse().map((layer) => (
      <div key={layer.key} className="flex items-center gap-1.5">
        <div className="w-3 h-2 rounded-sm" style={{ background: layer.color }} />
        <span style={{ fontSize: "0.63rem", color: "var(--dash-text-dim)" }}>{layer.label}</span>
      </div>
    ))}
  </div>
);

export const CFDiagram = memo(function CFDiagram({ data }: Props) {
  const { isDark } = useTheme();
  const cursorStrokeColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  const midPoint = data[Math.floor(data.length / 2)];
  const lastPoint = data[data.length - 1];

  // WIP = everything between Todo and Deployed (exclusive)
  const wipKeys = ["inProgress", "review", "test", "testFailed", "testPassed"] as const;
  const wipMid  = wipKeys.reduce((s, k) => s + midPoint[k], 0);
  const wipLast = wipKeys.reduce((s, k) => s + lastPoint[k], 0);
  const widening = wipLast > wipMid * 1.1;

  return (
    <div
      className="rounded-xl p-[8px]"
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
            style={{ background: "rgba(167,139,250,0.15)" }}
          >
            <GitBranch size={14} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
              Cumulative Flow Diagram
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>
              Task count per stage · Sprint 24
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {widening && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                fontSize: "0.68rem",
                color: "#ef4444",
                fontWeight: 600,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              Widening WIP detected
            </div>
          )}
          <div
            className="px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(16,185,129,0.1)",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#10b981",
            }}
          >
            {lastPoint.done} done
          </div>
        </div>
      </div>

      <CustomLegend />

      <div style={{ width: "100%", height: 240 }} className="mt-3">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              {CFD_LAYERS.map((layer) => (
                <linearGradient key={layer.gradId} id={layer.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={layer.color} stopOpacity={0.85} />
                  <stop offset="100%" stopColor={layer.color} stopOpacity={0.45} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-grid)" vertical={false} />
            <XAxis
              dataKey="date"
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
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorStrokeColor }} />

            {CFD_LAYERS.map((layer) => (
              <Area
                key={layer.key}
                type="monotone"
                dataKey={layer.key}
                stackId="1"
                stroke={layer.color}
                strokeWidth={1.5}
                fill={`url(#${layer.gradId})`}
                name={layer.label}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insight bar */}
      <div
        className="flex flex-wrap items-center gap-4 rounded-xl px-[12px] py-[8px] m-[0px]"
        style={{ background: "var(--dash-hover)", border: "1px solid var(--dash-border-subtle)" }}
      >
        {[
          { label: "Done",        value: `${lastPoint.done} tasks`,       color: "#10b981" },
          { label: "Deployed",    value: `${lastPoint.deployed} tasks`,    color: "#a78bfa" },
          { label: "In Test",     value: `${lastPoint.test} tasks`,        color: "#60a5fa" },
          { label: "In Progress", value: `${lastPoint.inProgress} tasks`,  color: "#FF910B" },
          { label: "Remaining",   value: `${lastPoint.todo} tasks`,        color: "var(--dash-text-dim)" },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            className="flex flex-col"
            style={{
              paddingRight: i < arr.length - 1 ? 16 : 0,
              borderRight: i < arr.length - 1 ? "1px solid var(--dash-border)" : "none",
            }}
          >
            <span style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>{item.label}</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: item.color }}>{item.value}</span>
          </div>
        ))}
        <div className="ml-auto">
          <span style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>
            Wider Test band indicates QC bottleneck. Consider adding QA capacity.
          </span>
        </div>
      </div>
    </div>
  );
});