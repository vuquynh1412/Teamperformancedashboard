import { ArrowUpRight, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";

interface TeamScoreProps {
  score: number;
}

function getScoreStatus(score: number) {
  if (score >= 85) return { label: "Excellent", color: "#22c55e", bg: "rgba(34,197,94,0.12)" };
  if (score >= 70) return { label: "On Track", color: "#FF910B", bg: "rgba(255,145,11,0.12)" };
  if (score >= 55) return { label: "At Risk", color: "#eab308", bg: "rgba(234,179,8,0.12)" };
  return { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
}

const insights = [
  { icon: CheckCircle2, text: "Quality metrics above team average", color: "#22c55e" },
  { icon: AlertTriangle, text: "QC bottleneck slowing cycle time", color: "#eab308" },
  { icon: TrendingUp, text: "Velocity trending up +4% vs last sprint", color: "#FF910B" },
];

export function TeamScore({ score }: TeamScoreProps) {
  const status = getScoreStatus(score);
  const circumference = 2 * Math.PI * 52;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div
      className="rounded-xl flex flex-col gap-4 p-[8px]"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span style={{ fontSize: "0.75rem", color: "var(--dash-text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Team Score
        </span>
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-md"
          style={{ background: status.bg, color: status.color, fontSize: "0.7rem", fontWeight: 600 }}
        >
          {status.label}
          <ArrowUpRight size={11} />
        </span>
      </div>

      {/* Score + ring + insights */}
      <div className="flex items-center gap-5">
        {/* Circular progress */}
        <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--dash-border)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#FF910B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--dash-text-primary)", lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--dash-text-dim)", marginTop: 2 }}>/ 100</span>
          </div>
        </div>

        {/* Right side: label + bar + insights */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: "0.7rem", color: "var(--dash-text-dim)" }}>Overall Progress</span>
              <span style={{ fontSize: "0.7rem", color: "#FF910B", fontWeight: 600 }}>{score}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${score}%`,
                  background: "linear-gradient(90deg, #FF910B, #FFB347)",
                  transition: "width 1s ease-in-out",
                }}
              />
            </div>
          </div>

          {/* Insight lines */}
          <div className="flex flex-col gap-1.5">
            {insights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <item.icon size={13} style={{ color: item.color, marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: "0.7rem", color: "var(--dash-text-muted)", lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}