import { Lightbulb, AlertTriangle, XCircle, Info } from "lucide-react";
import type { InsightItem } from "./mockData";

interface Props {
  insights: InsightItem[];
}

const insightConfig = {
  critical: {
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    color: "#eab308",
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.2)",
    label: "Warning",
  },
  info: {
    icon: Info,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    label: "Info",
  },
};

export function InsightPanel({ insights }: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden h-full"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-5 pb-4" style={{ borderBottom: "1px solid var(--dash-border-mid)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,145,11,0.12)" }}>
          <Lightbulb size={14} style={{ color: "#FF910B" }} />
        </div>
        <div>
          <h3 style={{ color: "var(--dash-text-primary)", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
            AI Insights
          </h3>
          <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>Sprint 24 · Auto-generated</p>
        </div>
        <div
          className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,145,11,0.1)", fontSize: "0.6rem", color: "#FF910B", fontWeight: 600 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF910B] animate-pulse" />
          Live
        </div>
      </div>

      {/* Insights list */}
      <div className="p-4 flex flex-col gap-3">
        {insights.map((item, idx) => {
          const config = insightConfig[item.type];
          const Icon = config.icon;
          return (
            <div
              key={idx}
              className="rounded-xl p-4 flex gap-3 transition-all duration-200 cursor-default"
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `rgba(${item.type === 'critical' ? '239,68,68' : item.type === 'warning' ? '234,179,8' : '96,165,250'},0.15)` }}
              >
                <Icon size={14} style={{ color: config.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block px-1.5 py-0.5 rounded mb-1.5"
                  style={{ background: `rgba(${item.type === 'critical' ? '239,68,68' : item.type === 'warning' ? '234,179,8' : '96,165,250'},0.15)`, color: config.color, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  {config.label}
                </span>
                <p style={{ fontSize: "0.75rem", color: "var(--dash-text-secondary)", lineHeight: 1.55 }}>{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-1">
        <button
          className="w-full py-2 rounded-xl text-center transition-opacity hover:opacity-70"
          style={{
            background: "rgba(255,145,11,0.08)",
            border: "1px solid rgba(255,145,11,0.2)",
            color: "#FF910B",
            fontSize: "0.72rem",
            fontWeight: 600,
          }}
        >
          View Full Report →
        </button>
      </div>
    </div>
  );
}
