import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";

interface QualityData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: QualityData[];
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
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
    </g>
  );
};

export function QualityDonut({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null,
  );

  const passRate =
    data.find((d) => d.name === "Pass")?.value ?? 0;
  const activeItem =
    activeIndex !== null ? data[activeIndex] : null;

  const centerValue = activeItem ? activeItem.value : passRate;
  const centerLabel = activeItem ? activeItem.name : "Pass";
  const centerColor = activeItem ? activeItem.color : "#22c55e";

  return (
    <div
      className="rounded-xl p-[8px]"
      style={{
        background: "var(--dash-card)",
        border: "1px solid var(--dash-border)",
        boxShadow: "var(--dash-shadow)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.12)" }}
        >
          <ShieldCheck size={14} style={{ color: "#22c55e" }} />
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
            Quality Breakdown
          </h3>
          <p
            style={{
              color: "var(--dash-text-dim)",
              fontSize: "0.68rem",
            }}
          >
            Pass / Rework / Failed
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Donut */}
        <div
          className="relative flex-shrink-0"
          style={{ width: 120, height: 120 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
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
                        : 0.35
                    }
                    style={{ transition: "opacity 0.15s" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label — updates on hover */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ transition: "all 0.15s" }}
          >
            <span
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: centerColor,
                lineHeight: 1,
                transition: "color 0.15s",
              }}
            >
              {centerValue}%
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                color: "var(--dash-text-dim)",
                marginTop: 2,
                transition: "opacity 0.15s",
              }}
            >
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {data.map((item, idx) => {
            const isActive = activeIndex === idx;
            const isDimmed = activeIndex !== null && !isActive;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg px-2 py-1 cursor-pointer transition-all duration-150"
                style={{
                  background: isActive
                    ? `${item.color}12`
                    : "transparent",
                  opacity: isDimmed ? 0.4 : 1,
                  border: `1px solid ${isActive ? item.color + "30" : "transparent"}`,
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
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
                      fontSize: "0.72rem",
                      color: isActive
                        ? item.color
                        : "var(--dash-text-muted)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {item.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: isActive
                      ? item.color
                      : "var(--dash-text-primary)",
                  }}
                >
                  {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}