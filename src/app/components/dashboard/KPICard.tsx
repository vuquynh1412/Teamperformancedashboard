import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  PackageCheck,
  ShieldCheck,
  Gauge,
  Star,
  Workflow,
  LucideIcon,
} from "lucide-react";

export interface KPIItem {
  key: string;
  label: string;
  score: number;
  trend: number; // % change vs last sprint
  description: string;
  icon: LucideIcon;
}

export const kpiConfig: KPIItem[] = [
  {
    key: "output",
    label: "Output",
    score: 82,
    trend: 4,
    description: "Tasks completed vs committed this sprint",
    icon: PackageCheck,
  },
  {
    key: "reliability",
    label: "Reliability",
    score: 75,
    trend: -2,
    description: "Consistency of delivery across team members",
    icon: ShieldCheck,
  },
  {
    key: "speed",
    label: "Speed",
    score: 68,
    trend: -5,
    description: "Average cycle time relative to target",
    icon: Gauge,
  },
  {
    key: "quality",
    label: "Quality",
    score: 84,
    trend: 1,
    description: "Pass rate and rework percentage",
    icon: Star,
  },
  {
    key: "flow",
    label: "Flow",
    score: 71,
    trend: 3,
    description: "Work in progress smoothness and blockers",
    icon: Workflow,
  },
];

function getScoreColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#FF910B";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

function getScoreBg(score: number) {
  if (score >= 80) return "rgba(34,197,94,0.1)";
  if (score >= 65) return "rgba(255,145,11,0.1)";
  if (score >= 50) return "rgba(234,179,8,0.1)";
  return "rgba(239,68,68,0.1)";
}

interface KPICardProps {
  item: KPIItem;
  isLowest: boolean;
  isSelected: boolean;
  onClick: (key: string) => void;
}

export function KPICard({ item, isLowest, isSelected, onClick }: KPICardProps) {
  const scoreColor = getScoreColor(item.score);
  const scoreBg = getScoreBg(item.score);
  const Icon = item.icon;

  const trendPositive = item.trend > 0;
  const trendNeutral = item.trend === 0;
  const TrendIcon = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown;
  const trendColor = trendNeutral ? "#636778" : trendPositive ? "#22c55e" : "#ef4444";

  return (
    <Tooltip>
      <TooltipTrigger className="px-[8px] py-[16px] p-[8px]" asChild>
        <div
          onClick={() => onClick(item.key)}
          className="rounded-xl p-4 cursor-pointer flex flex-col gap-3 transition-all duration-200"
          style={{
            background: isSelected ? "rgba(255,145,11,0.08)" : "var(--dash-card)",
            border: isSelected
              ? "1px solid rgba(255,145,11,0.4)"
              : isLowest
              ? "1px solid rgba(239,68,68,0.35)"
              : "1px solid var(--dash-border)",
            boxShadow: isSelected
              ? "0 0 0 1px rgba(255,145,11,0.2), var(--dash-shadow)"
              : "var(--dash-shadow)",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = isSelected
              ? "0 0 0 1px rgba(255,145,11,0.3), var(--dash-shadow-lg)"
              : "var(--dash-shadow-lg)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = isSelected
              ? "0 0 0 1px rgba(255,145,11,0.2), var(--dash-shadow)"
              : "var(--dash-shadow)";
          }}
        >
          {/* Icon + trend */}
          <div className="flex items-center justify-between">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: scoreBg }}
            >
              <Icon size={15} style={{ color: scoreColor }} />
            </div>
            <div className="flex items-center gap-0.5" style={{ color: trendColor, fontSize: "0.68rem", fontWeight: 600 }}>
              <TrendIcon size={11} />
              <span>{trendNeutral ? "—" : `${Math.abs(item.trend)}%`}</span>
            </div>
          </div>

          {/* Score */}
          <div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--dash-text-primary)", lineHeight: 1 }}>
              {item.score}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--dash-text-dim)", marginTop: 3 }}>{item.label}</div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.score}%`, background: scoreColor }}
              />
            </div>
          </div>

          {/* Lowest indicator */}
          {isLowest && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md self-start"
              style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", fontSize: "0.62rem", fontWeight: 600 }}
            >
              ↓ Lowest
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="rounded-xl border-0"
        style={{ background: "var(--dash-elevated)", color: "var(--dash-text-secondary)", fontSize: "0.72rem", maxWidth: 200, padding: "8px 12px" }}
      >
        <p style={{ fontWeight: 600, color: "var(--dash-text-primary)", marginBottom: 2 }}>{item.label}</p>
        <p>{item.description}</p>
        <p style={{ marginTop: 4, color: trendColor }}>
          {trendNeutral ? "No change" : trendPositive ? `↑ +${item.trend}% vs last sprint` : `↓ ${item.trend}% vs last sprint`}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}