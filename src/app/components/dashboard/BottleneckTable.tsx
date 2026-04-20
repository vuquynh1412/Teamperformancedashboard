import { AlertOctagon } from "lucide-react";
import type { BottleneckRow } from "./mockData";

interface Props {
  data: BottleneckRow[];
}

// Stage badge color by index (maps to the workflow pipeline colors)
const STAGE_COLORS: Record<string, string> = {
  "Todo":        "#64748b",
  "In Progress": "#FF910B",
  "Review":      "#eab308",
  "Test":        "#60a5fa",
  "Test Failed": "#ef4444",
  "Test Passed": "#22c55e",
  "Deployed":    "#a78bfa",
  "Done":        "#10b981",
};

function StatusBadge({ status }: { status: BottleneckRow["status"] }) {
  const config = {
    ok:       { label: "Healthy",  color: "#22c55e", bg: "rgba(34,197,94,0.12)"  },
    warning:  { label: "Warning",  color: "#eab308", bg: "rgba(234,179,8,0.12)"  },
    critical: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.12)"  },
  };
  const c = config[status];
  return (
    <span
      className="px-2 py-0.5 rounded-md"
      style={{ background: c.bg, color: c.color, fontSize: "0.67rem", fontWeight: 600 }}
    >
      {c.label}
    </span>
  );
}

export function BottleneckTable({ data }: Props) {
  const maxDays    = Math.max(...data.map((d) => d.avgDays));
  const slowestIdx = data.findIndex((d) => d.avgDays === maxDays);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 p-[8px]"
        style={{ borderBottom: "1px solid var(--dash-border-mid)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.12)" }}
        >
          <AlertOctagon size={14} style={{ color: "#ef4444" }} />
        </div>
        <div>
          <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
            Pipeline Bottlenecks
          </h3>
          <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>Average time per stage</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--dash-border-subtle)" }}>
            {["Stage", "Avg Time", "Bar", "Status"].map((h) => (
              <th
                key={h}
                className="px-5 py-2.5 text-left"
                style={{
                  fontSize: "0.65rem",
                  color: "var(--dash-text-dim)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const isSlowest = idx === slowestIdx;
            const barWidth  = (row.avgDays / maxDays) * 100;
            const stageColor = STAGE_COLORS[row.stage] ?? "#64748b";
            const barColor   =
              row.status === "critical" ? "#ef4444"
              : row.status === "warning"  ? "#eab308"
              : "#22c55e";

            return (
              <tr
                key={row.stage}
                style={{
                  borderBottom: "1px solid var(--dash-border-xs)",
                  background: isSlowest ? "rgba(239,68,68,0.05)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                {/* Stage */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {/* Stage color dot */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: stageColor }}
                    />
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: isSlowest ? "var(--dash-text-primary)" : "var(--dash-text-secondary)",
                        fontWeight: isSlowest ? 600 : 400,
                      }}
                    >
                      {row.stage}
                    </span>
                    {isSlowest && (
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          color: "#ef4444",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                        }}
                      >
                        SLOWEST
                      </span>
                    )}
                  </div>
                </td>

                {/* Time */}
                <td className="px-5 py-3">
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: isSlowest ? "#ef4444" : "var(--dash-text-muted)",
                      fontWeight: isSlowest ? 700 : 400,
                    }}
                  >
                    {row.avgTime}
                  </span>
                </td>

                {/* Bar */}
                <td className="px-5 py-3" style={{ width: 180 }}>
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ background: "var(--dash-border)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%`, background: barColor }}
                    />
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
