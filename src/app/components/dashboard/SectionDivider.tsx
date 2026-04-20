import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionDivider({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-center justify-between mb-4 mt-2">
      
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}
