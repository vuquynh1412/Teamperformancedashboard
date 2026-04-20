import { CalendarDays, Sun, Moon, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { projects, sprints } from "./mockData";
import { useTheme } from "./ThemeContext";

interface HeaderProps {
  selectedProject: string;
  setSelectedProject: (v: string) => void;
  selectedSprint: string;
  setSelectedSprint: (v: string) => void;
  sprint: { name: string; dates: string; project: string };
}

export function Header({
  selectedProject,
  setSelectedProject,
  selectedSprint,
  setSelectedSprint,
  sprint,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left: title + sprint info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,145,11,0.15)" }}>
          <Zap size={18} style={{ color: "#FF910B" }} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.2, color: "var(--dash-text-primary)" }}>
            Team Performance
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--dash-text-dim)", lineHeight: 1.4 }}>
            {sprint.name} &nbsp;·&nbsp; {sprint.dates}
          </p>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Project Select */}
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          
          <SelectContent
            className="rounded-xl"
            style={{
              background: "var(--dash-elevated)",
              border: "1px solid var(--dash-border)",
            }}
          >
            {projects.map((p) => (
              <SelectItem
                key={p}
                value={p}
                style={{ fontSize: "0.75rem", color: "var(--dash-text-secondary)" }}
              >
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sprint Select */}
        <Select value={selectedSprint} onValueChange={setSelectedSprint}>
          <SelectTrigger
            className="w-[120px] h-8 rounded-lg border-0"
            style={{
              background: "var(--dash-subtle)",
              fontSize: "0.75rem",
              color: "var(--dash-text-secondary)",
            }}
          >
            <SelectValue placeholder="Sprint" />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl"
            style={{
              background: "var(--dash-elevated)",
              border: "1px solid var(--dash-border)",
            }}
          >
            {sprints.map((s) => (
              <SelectItem
                key={s}
                value={s}
                style={{ fontSize: "0.75rem", color: "var(--dash-text-secondary)" }}
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range */}
        <div
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            background: "var(--dash-subtle)",
            fontSize: "0.75rem",
            color: "var(--dash-text-secondary)",
          }}
        >
          <CalendarDays size={13} style={{ color: "var(--dash-text-dim)" }} />
          <span>Apr 7 – Apr 18</span>
        </div>

        {/* Light / Dark toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:opacity-80"
          style={{
            background: isDark ? "rgba(255,145,11,0.12)" : "rgba(255,145,11,0.10)",
            border: "1px solid rgba(255,145,11,0.25)",
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <Sun size={14} style={{ color: "#FF910B" }} />
          ) : (
            <Moon size={14} style={{ color: "#FF910B" }} />
          )}
        </button>
      </div>
    </div>
  );
}
