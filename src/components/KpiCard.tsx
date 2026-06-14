import { Card } from "./Card";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export function KpiCard({ label, value, sub, icon, accent }: KpiCardProps) {
  return (
    <Card className={accent ? "border-orange-200 bg-orange-50" : ""}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-orange-600" : "text-slate-900"}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </Card>
  );
}
