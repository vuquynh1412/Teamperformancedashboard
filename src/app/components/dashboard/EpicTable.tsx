import { memo, useRef, useCallback } from "react";
import { Layers } from "lucide-react";
import { useHoverPortal, PortalCard } from "./PortalHover";
import type { EpicRow } from "./mockData";

interface Props {
  epics: EpicRow[];
  selectedEpic: string | null;
  onSelect: (name: string) => void;
}

export const EPIC_STAGES = [
  { key: "todo",       label: "Todo",        color: "#64748b" },
  { key: "inProgress", label: "In Progress", color: "#FF910B" },
  { key: "review",     label: "Review",      color: "#eab308" },
  { key: "test",       label: "Test",        color: "#60a5fa" },
  { key: "testFailed", label: "Test Failed", color: "#ef4444" },
  { key: "testPassed", label: "Test Passed", color: "#22c55e" },
  { key: "deployed",   label: "Deployed",    color: "#a78bfa" },
  { key: "done",       label: "Done",        color: "#10b981" },
] as const;

type StageKey = (typeof EPIC_STAGES)[number]["key"];

// Hover card dimensions — slightly over-estimated so flip logic is accurate
const EPIC_HOVER_W = 264;
const EPIC_HOVER_H = 308; // title + summary + 8 stage rows

// ─── Mini stacked progress bar ────────────────────────────────────────────────
function MiniStackedBar({ row }: { row: EpicRow }) {
  const pct = (n: number) => `${Math.round((n / row.total) * 100)}%`;
  return (
    <div className="flex w-full h-1.5 rounded-full overflow-hidden gap-px">
      {([...EPIC_STAGES].reverse() as typeof EPIC_STAGES).map((s) => {
        const val = row[s.key as StageKey] as number;
        return val > 0 ? (
          <div
            key={s.key}
            style={{
              width: pct(val),
              background: s.color,
              transition: "width 0.6s ease",
              flexShrink: 0,
            }}
          />
        ) : null;
      })}
    </div>
  );
}

// ─── Status chip ──────────────────────────────────────────────────────────────
function StatusChip({ label, color, count }: { label: string; color: string; count: number }) {
  if (count === 0) return null;
  return (
    <span
      className="px-1.5 py-0.5 rounded"
      style={{
        background: `${color}18`,
        color,
        fontSize: "0.58rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {count} {label}
    </span>
  );
}

// ─── Hover card content ───────────────────────────────────────────────────────
function EpicHoverContent({ epic }: { epic: EpicRow }) {
  const donePct = Math.round((epic.done / epic.total) * 100);
  return (
    <>
      {/* Title */}
      <p
        style={{
          fontWeight: 700,
          color: "var(--dash-text-primary)",
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {epic.name}
      </p>

      {/* Summary row */}
      <div
        className="flex items-center gap-4 mb-3 pb-3"
        style={{ borderBottom: "1px solid var(--dash-border)" }}
      >
        <div>
          <div style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>Total</div>
          <div style={{ fontWeight: 700, color: "var(--dash-text-primary)" }}>{epic.total}</div>
        </div>
        <div>
          <div style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>Done</div>
          <div style={{ fontWeight: 700, color: "#10b981" }}>{donePct}%</div>
        </div>
        <div>
          <div style={{ fontSize: "0.62rem", color: "var(--dash-text-dim)" }}>Remaining</div>
          <div style={{ fontWeight: 700, color: "var(--dash-text-muted)" }}>
            {epic.total - epic.done}
          </div>
        </div>
      </div>

      {/* Stage breakdown */}
      <div className="flex flex-col gap-1.5">
        {EPIC_STAGES.slice()
          .reverse()
          .map((s) => {
            const val = epic[s.key as StageKey] as number;
            const pct = Math.round((val / epic.total) * 100);
            return (
              <div key={s.key} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <span style={{ color: "var(--dash-text-dim)" }}>{s.label}</span>
                </div>
                <span
                  style={{
                    color:
                      val > 0 ? "var(--dash-text-primary)" : "var(--dash-text-dim)",
                    fontWeight: val > 0 ? 600 : 400,
                    flexShrink: 0,
                  }}
                >
                  {val}
                  {val > 0 && (
                    <span style={{ color: "var(--dash-text-dim)", fontWeight: 400 }}>
                      {" "}
                      ({pct}%)
                    </span>
                  )}
                </span>
              </div>
            );
          })}
      </div>
    </>
  );
}

// ─── Single row ───────────────────────────────────────────────────────────────
function EpicRowItem({
  epic,
  idx,
  isLast,
  selectedEpic,
  onSelect,
}: {
  epic: EpicRow;
  idx: number;
  isLast: boolean;
  selectedEpic: string | null;
  onSelect: (name: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { visible, pos, onMouseEnter, onMouseLeave } = useHoverPortal({
    cardW: EPIC_HOVER_W,
    cardH: EPIC_HOVER_H,
  });

  const isSelected = selectedEpic === epic.name;
  const donePct = Math.round((epic.done / epic.total) * 100);

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSelected) {
        (e.currentTarget as HTMLDivElement).style.background = "var(--dash-hover)";
      }
      onMouseEnter(e.currentTarget);
    },
    [isSelected, onMouseEnter],
  );

  const handleLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSelected) {
        (e.currentTarget as HTMLDivElement).style.background =
          isSelected ? "rgba(255,145,11,0.07)" : "transparent";
      }
      onMouseLeave();
    },
    [isSelected, onMouseLeave],
  );

  return (
    <>
      <div
        ref={rowRef}
        onClick={() => onSelect(epic.name)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="grid cursor-pointer transition-colors duration-150 px-[8px] py-[6px]"
        style={{
          gridTemplateColumns: "1fr 52px 180px 1fr",
          alignItems: "center",
          borderBottom: !isLast ? "1px solid var(--dash-border-xs)" : "none",
          background: isSelected ? "rgba(255,145,11,0.07)" : "transparent",
          borderLeft: isSelected ? "2px solid #FF910B" : "2px solid transparent",
        }}
      >
        {/* Epic name */}
        <div className="min-w-0 pr-4">
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: isSelected ? "#FF910B" : "var(--dash-text-secondary)",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {epic.name}
          </span>
        </div>

        {/* Total */}
        <div style={{ fontSize: "0.78rem", color: "var(--dash-text-muted)" }}>
          {epic.total}
        </div>

        {/* Progress bar + pct */}
        <div className="pr-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <MiniStackedBar row={epic} />
            </div>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color:
                  donePct >= 70 ? "#10b981" : donePct >= 40 ? "#FF910B" : "#eab308",
                flexShrink: 0,
              }}
            >
              {donePct}%
            </span>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-1">
          {EPIC_STAGES.slice()
            .reverse()
            .map((s) => {
              const val = epic[s.key as StageKey] as number;
              return (
                <StatusChip key={s.key} label={s.label} color={s.color} count={val} />
              );
            })}
        </div>
      </div>

      {/* Portal hover card — escapes overflow:hidden */}
      <PortalCard visible={visible} pos={pos} width={EPIC_HOVER_W}>
        <EpicHoverContent epic={epic} />
      </PortalCard>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export const EpicTable = memo(function EpicTable({ epics, selectedEpic, onSelect }: Props) {
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
        className="flex items-center justify-between p-[8px]"
        style={{ borderBottom: "1px solid var(--dash-border-mid)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(167,139,250,0.15)" }}
          >
            <Layers size={14} style={{ color: "#a78bfa" }} />
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
              Epic Breakdown
            </h3>
            <p style={{ color: "var(--dash-text-dim)", fontSize: "0.68rem" }}>
              {epics.length} epics · Sprint 24
            </p>
          </div>
        </div>

        {/* Legend */}
        <div
          className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1"
          style={{ maxWidth: 420 }}
        >
          {EPIC_STAGES.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
              <span style={{ fontSize: "0.6rem", color: "var(--dash-text-dim)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid p-[8px]"
        style={{
          gridTemplateColumns: "1fr 52px 180px 1fr",
          borderBottom: "1px solid var(--dash-border-xs)",
        }}
      >
        {["Epic", "Total", "Progress", "Status"].map((h) => (
          <div
            key={h}
            style={{
              fontSize: "0.6rem",
              color: "var(--dash-text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {epics.map((epic, idx) => (
          <EpicRowItem
            key={epic.id}
            epic={epic}
            idx={idx}
            isLast={idx === epics.length - 1}
            selectedEpic={selectedEpic}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
});
