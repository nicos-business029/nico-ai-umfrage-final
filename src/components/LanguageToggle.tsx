import { useLanguage, type Lang } from "../lib/i18n";

const OPTIONS: { val: Lang; label: string }[] = [
  { val: "de", label: "Deutsch" },
  { val: "en", label: "English" },
];

export function LanguageToggle({ size = "md" }: { size?: "sm" | "md" }) {
  const { lang, setLang } = useLanguage();
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white overflow-hidden">
      {OPTIONS.map((o) => (
        <button
          key={o.val}
          onClick={() => setLang(o.val)}
          className={`${pad} font-medium transition-colors cursor-pointer ${
            lang === o.val ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
