import { CheckCircle, Mail } from "lucide-react";
import { useLanguage, CONTACT_EMAIL, CONTACT_NAME } from "../lib/i18n";

export function Danke() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle size={56} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{t.danke.title}</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">{t.danke.text}</p>
        <div className="flex items-start gap-2 text-left bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4">
          <Mail size={16} className="text-orange-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600">
            {t.danke.contactPrefix}<br />
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
