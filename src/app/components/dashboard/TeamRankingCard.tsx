import { memo, useRef, useCallback } from "react";
import { Trophy, Clock, CheckSquare, Zap } from "lucide-react";
import { useHoverPortal, PortalCard } from "./PortalHover";
import type { TeamMember } from "./mockData";

interface Props {
  members: TeamMember[];
  selectedAssignee: string | null;
  onSelect: (name: string) => void;
}

const medalConfig = [
  { color: "#FFD700", bg: "rgba(255,215,0,0.15)",   border: "rgba(255,215,0,0.3)",   label: "Gold"   },
  { color: "#C0C0C0", bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.25)", label: "Silver" },
  { color: "#CD7F32", bg: "rgba(205,127,50,0.15)",  border: "rgba(205,127,50,0.3)",  label: "Bronze" },
];

const avatarColors = [
  "#FF910B", "#22c55e", "#60a5fa", "#a78bfa", "#f472b6", "#34d399", "#fb923c",
];

// Hover card dimensions — slightly over-estimated for accurate flip logic
const MEMBER_HOVER_W = 244;
const MEMBER_HOVER_H = 210;

// ─── Hover card content ───────────────────────────────────────────────────────
function MemberHoverContent({
  member,
  isTop3,
  medal,
  avatarColor,
}: {
  member: TeamMember;
  isTop3: boolean;
  medal: (typeof medalConfig)[0] | null;
  avatarColor: string;
}) {
  const efficiencyRaw = member.tasksCompleted / member.avgCycleTime;

  return (
    <>
      {/* Name + role */}
      <div className="flex items-center gap-2 mb-3">
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `${avatarColor}22`,
            border: `1.5px solid ${avatarColor}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.6rem",
            fontWeight: 700,
            color: avatarColor,
            flexShrink: 0,
          }}
        >
          {member.initials}
        </div>
        <div>
          <p style={{ fontWeight: 700, color: "var(--dash-text-primary)", lineHeight: 1.2 }}>
            {member.name}
          </p>
          <p style={{ color: "var(--dash-text-dim)", fontSize: "0.65rem" }}>{member.role}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between gap-4">
          <span style={{ color: "var(--dash-text-dim)" }}>Tasks done</span>
          <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>
            {member.tasksCompleted}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: "var(--dash-text-dim)" }}>Avg cycle time</span>
          <span style={{ color: "var(--dash-text-primary)", fontWeight: 600 }}>
            {member.avgCycleTime} days
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: "var(--dash-text-dim)" }}>Raw efficiency</span>
          <span style={{ color: "#FF910B", fontWeight: 600 }}>
            {efficiencyRaw.toFixed(2)} t/d
          </span>
        </div>
        <div
          className="flex justify-between gap-4 pt-1.5 mt-0.5"
          style={{ borderTop: "1px solid var(--dash-border)" }}
        >
          <span style={{ color: "var(--dash-text-dim)" }}>Normalized score</span>
          <span
            style={{
              fontWeight: 700,
              color: isTop3 ? medal!.color : "var(--dash-text-muted)",
            }}
          >
            {member.efficiencyScore} / 100
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div
        className="mt-3 w-full rounded-full overflow-hidden"
        style={{ height: 3, background: "var(--dash-border)" }}
      >
        <div
          style={{
            height: "100%",
            width: `${member.efficiencyScore}%`,
            background: isTop3 ? medal!.color : "#60a5fa",
            borderRadius: 99,
          }}
        />
      </div>
    </>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────
function MemberRow({
  member,
  rank,
  isSelected,
  onClick,
}: {
  member: TeamMember;
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { visible, pos, onMouseEnter, onMouseLeave } = useHoverPortal({
    cardW: MEMBER_HOVER_W,
    cardH: MEMBER_HOVER_H,
  });

  const isTop3 = rank <= 3;
  const medal = isTop3 ? medalConfig[rank - 1] : null;
  const avatarColor = avatarColors[(rank - 1) % avatarColors.length];

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter(e.currentTarget);
    },
    [onMouseEnter],
  );

  const bg = isSelected
    ? "rgba(255,145,11,0.08)"
    : isTop3
    ? medal!.bg
    : "transparent";

  const borderStyle = isSelected
    ? "1px solid rgba(255,145,11,0.35)"
    : isTop3
    ? `1px solid ${medal!.border}`
    : "1px solid transparent";

  return (
    <>
      <div
        ref={rowRef}
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={onMouseLeave}
        className="flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-150 p-[4px] px-[6px] py-[4px]"
        style={{
          background: bg,
          border: borderStyle,
        }}
        /* Inline hover highlight via CSS — avoid setState to prevent position flash */
        onMouseOver={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLDivElement).style.background = isTop3
              ? medal!.bg
              : "var(--dash-hover)";
          }
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = bg;
        }}
      >
        {/* Rank */}
        <div
          className="w-6 flex-shrink-0 flex items-center justify-center"
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: isTop3 ? medal!.color : "var(--dash-text-dim)",
          }}
        >
          {isTop3 ? (
            <Trophy size={14} style={{ color: medal!.color }} />
          ) : (
            `#${rank}`
          )}
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `${avatarColor}22`,
            border: `1.5px solid ${avatarColor}55`,
            fontSize: "0.65rem",
            fontWeight: 700,
            color: avatarColor,
            letterSpacing: "0.02em",
          }}
        >
          {member.initials}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: isSelected ? "#FF910B" : "var(--dash-text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.name}
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--dash-text-dim)" }}>
            {member.role}
          </div>
        </div>

        {/* Tasks */}
        <div className="flex flex-col items-center flex-shrink-0 w-10">
          <span
            style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--dash-text-primary)" }}
          >
            {member.tasksCompleted}
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--dash-text-dim)" }}>tasks</span>
        </div>

        {/* Cycle time */}
        <div className="flex flex-col items-center flex-shrink-0 w-12">
          <span
            style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--dash-text-muted)" }}
          >
            {member.avgCycleTime}d
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--dash-text-dim)" }}>avg time</span>
        </div>

        {/* Efficiency bar */}
        <div className="flex-shrink-0 w-20">
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "0.6rem", color: "var(--dash-text-dim)" }}>Score</span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: isTop3 ? medal!.color : "var(--dash-text-muted)",
              }}
            >
              {member.efficiencyScore}
            </span>
          </div>
          <div
            className="w-full h-1 rounded-full overflow-hidden"
            style={{ background: "var(--dash-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${member.efficiencyScore}%`,
                background: isTop3 ? medal!.color : "var(--dash-text-muted)",
                opacity: isTop3 ? 1 : 0.5,
              }}
            />
          </div>
        </div>
      </div>

      {/* Portal hover card — escapes overflow:hidden */}
      <PortalCard visible={visible} pos={pos} width={MEMBER_HOVER_W}>
        <MemberHoverContent
          member={member}
          isTop3={isTop3}
          medal={medal}
          avatarColor={avatarColor}
        />
      </PortalCard>
    </>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export const TeamRankingCard = memo(function TeamRankingCard({
  members,
  selectedAssignee,
  onSelect,
}: Props) {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      {/* Header — sticky: outside scroll area */}
      <div
        className="flex items-center justify-between flex-shrink-0 p-[8px]"
        style={{ borderBottom: "1px solid var(--dash-border-mid)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,215,0,0.12)" }}
          >
            <Trophy size={14} style={{ color: "#FFD700" }} />
          </div>
          <div>
            <h3
              style={{
                color: "var(--dash-text-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Top Performers
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>
              Ranked by efficiency score · Sprint 24
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          {["Gold", "Silver", "Bronze"].map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: medalConfig[i].color }}
              />
              <span style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column headers — sticky: outside scroll area */}
      <div
        className="flex items-center gap-3 flex-shrink-0 px-[8px] py-[4px]"
        style={{ borderBottom: "1px solid var(--dash-border-xs)" }}
      >
        <div className="w-6" />
        <div className="w-8" />
        <div className="flex-1" />
        <div
          className="w-10 flex items-center gap-1"
          style={{
            fontSize: "0.6rem",
            color: "var(--dash-text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <CheckSquare size={9} /> Tasks
        </div>
        <div
          className="w-12 flex items-center gap-1"
          style={{
            fontSize: "0.6rem",
            color: "var(--dash-text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <Clock size={9} /> Time
        </div>
        <div
          className="w-20 flex items-center gap-1"
          style={{
            fontSize: "0.6rem",
            color: "var(--dash-text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <Zap size={9} /> Efficiency
        </div>
      </div>

      {/* Rows — scrollable, clipped to show ~5.5 rows */}
      <div
        className="relative flex-shrink-0"
        style={{ height: 282 }}
      >
        {/* Inject webkit scrollbar hide once */}
        <style>{`.tr-scroll::-webkit-scrollbar{display:none}`}</style>

        {/* Scroll container */}
        <div
          className="tr-scroll flex flex-col gap-0.5 px-[4px] pt-[4px] pb-[0px]"
          style={{
            height: "100%",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties}
        >
          {members.map((member, idx) => (
            <MemberRow
              key={member.id}
              member={member}
              rank={idx + 1}
              isSelected={selectedAssignee === member.name}
              onClick={() => onSelect(member.name)}
            />
          ))}
          {/* Bottom spacer so last row isn't hidden fully behind fade */}
          <div style={{ height: 8, flexShrink: 0 }} />
        </div>

        {/* Scroll-hint fade — masks the cut-off half-row */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
            background: "linear-gradient(to bottom, transparent, var(--dash-card))",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
});