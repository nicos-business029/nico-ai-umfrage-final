import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Mail, Clock } from "lucide-react";
import { Button } from "../components/Button";
import { LanguageToggle } from "../components/LanguageToggle";
import { useLanguage, CONTACT_EMAIL, CONTACT_NAME } from "../lib/i18n";

export function Start() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">

        {/* Sprachauswahl */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{t.start.langLabel}</span>
          <LanguageToggle />
        </div>

        <div className="text-center">
          <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-wide mb-3">
            {t.start.eyebrow}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-5">
            {t.start.title}
          </h1>
          <div className="space-y-3 mb-6">
            {t.start.intro.map((para, i) => (
              <p key={i} className="text-base text-slate-500 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 text-sm text-slate-400 mb-8">
            <Clock size={14} />
            {t.start.meta}
          </div>
        </div>

        {/* Datenschutzhinweis */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">{t.start.privacyTitle}</span>
          </div>
          <ul className="text-sm text-slate-500 space-y-1.5 list-disc list-inside">
            {t.start.privacy.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link to="/interview">
            <Button size="lg" className="w-full sm:w-auto">
              {t.start.cta}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Kontakt */}
        <div className="mt-10 flex items-start gap-2 text-left bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4">
          <Mail size={16} className="text-orange-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600">
            {t.start.contactPrefix}{" "}
            <span className="font-semibold text-slate-800">{CONTACT_NAME}</span>{" · "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-orange-600 font-medium hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
