import { memo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { Tag } from "lucide-react";
import type { TaskTypeEntry } from "./mockData";

interface Props {
  data: TaskTypeEntry[];
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
    </g>
  );
};

export const TaskTypeDonut = memo(function TaskTypeDonut({
  data,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null,
  );

  const total = data.reduce((s, d) => s + d.count, 0);
  const activeItem =
    activeIndex !== null ? data[activeIndex] : null;

  const centerValue = activeItem ? activeItem.count : total;
  const centerLabel = activeItem ? activeItem.name : "tasks";
  const centerColor = activeItem
    ? activeItem.color
    : "var(--dash-text-primary)";

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
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(96,165,250,0.12)" }}
        >
          <Tag size={14} style={{ color: "#60a5fa" }} />
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
            Task Type Breakdown
          </h3>
          <p
            style={{
              color: "var(--dash-text-dim)",
              fontSize: "0.68rem",
            }}
          >
            {total} total tasks
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Donut */}
        <div
          className="relative flex-shrink-0"
          style={{ width: 140, height: 140 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={2}
                dataKey="count"
                startAngle={90}
                endAngle={-270}
                activeIndex={activeIndex ?? undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) =>
                  setActiveIndex(index)
                }
                onMouseLeave={() => setActiveIndex(null)}
                style={{ cursor: "pointer", outline: "none" }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                    opacity={
                      activeIndex === null ||
                      activeIndex === index
                        ? 1
                        : 0.3
                    }
                    style={{ transition: "opacity 0.15s" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label — updates on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              style={{
                fontSize: activeItem ? "1.15rem" : "1.35rem",
                fontWeight: 700,
                color: centerColor,
                lineHeight: 1,
                transition: "all 0.15s",
              }}
            >
              {centerValue}
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                color: "var(--dash-text-dim)",
                marginTop: 2,
                maxWidth: 60,
                textAlign: "center",
                lineHeight: 1.2,
                transition: "all 0.15s",
              }}
            >
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1 flex-1">
          {data.map((item, idx) => {
            const isActive = activeIndex === idx;
            const isDimmed = activeIndex !== null && !isActive;
            return (
              <div
                key={item.name}
                className="cursor-pointer rounded-lg transition-all duration-150"
                style={{
                  opacity: isDimmed ? 0.35 : 1,
                  background: isActive
                    ? `${item.color}12`
                    : "transparent",
                  padding: "4px 6px",
                  border: `1px solid ${isActive ? item.color + "30" : "transparent"}`,
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-150"
                      style={{
                        background: item.color,
                        transform: isActive
                          ? "scale(1.4)"
                          : "scale(1)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: isActive
                          ? item.color
                          : "var(--dash-text-secondary)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--dash-text-dim)",
                      }}
                    >
                      {item.count}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: isActive
                          ? item.color
                          : "var(--dash-text-primary)",
                        minWidth: 28,
                        textAlign: "right",
                      }}
                    >
                      {item.value}%
                    </span>
                  </div>
                </div>
                <div
                  className="w-full h-0.5 rounded-full overflow-hidden"
                  style={{ background: "var(--dash-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.value}%`,
                      background: item.color,
                      opacity: isActive ? 1 : 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});