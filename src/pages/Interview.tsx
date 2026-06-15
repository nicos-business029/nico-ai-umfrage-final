import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { LanguageToggle } from "../components/LanguageToggle";
import { useLanguage } from "../lib/i18n";
import type { SurveyResponse, Haeufigkeit } from "../lib/types";
import { SUBMIT_URL } from "../config";

type Draft = Partial<SurveyResponse>;

const TOTAL = 9;

export function InterviewPage() {
  const { t, lang } = useLanguage();
  const [draft, setDraft] = useState<Draft>({});
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const set = <K extends keyof SurveyResponse>(key: K, val: SurveyResponse[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return !!draft.hauptaufgabe?.trim();
      case 2: return !!draft.haeufigkeit;
      case 5: return draft.belastung != null;
      case 6: return draft.schonGezahlt != null;
      default: return true;
    }
  };

  const finish = async () => {
    setSubmitting(true);
    // Antworten im Netlify-Forms-Format (URL-codiert) an das versteckte
    // Formular "ai-umfrage" senden. Sie erscheinen danach im Netlify-Dashboard
    // unter "Forms" und lassen sich dort ansehen, exportieren und löschen.
    const felder: Record<string, string> = {
      sprache: lang,
      hauptaufgabe: draft.hauptaufgabe ?? "",
      haeufigkeit: draft.haeufigkeit ?? "selten",
      manuelleArbeit: draft.manuelleArbeit ?? "",
      aktuelleLoesung: draft.aktuelleLoesung ?? "",
      belastung: String(draft.belastung ?? ""),
      schonGezahlt: draft.schonGezahlt ? "Ja" : "Nein",
      schonGezahltWofuer: draft.schonGezahltWofuer ?? "",
      wunschtool: draft.wunschtool ?? "",
      rolle: draft.rolle ?? "",
      branche: draft.branche ?? "",
      feedback: draft.feedback ?? "",
    };
    const body = new URLSearchParams(felder).toString();
    try {
      if (SUBMIT_URL) {
        // no-cors: Google Apps Script sendet keine CORS-Header; die Antwort
        // ist nicht lesbar, aber die Daten kommen sicher in der Tabelle an.
        await fetch(SUBMIT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
      }
    } catch {
      // Netzwerkfehler – trotzdem zur Danke-Seite
    }
    navigate("/danke");
  };

  const inputBase =
    "w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 mr-4">
            <ProgressBar current={step} total={TOTAL} />
          </div>
          <LanguageToggle size="sm" />
        </div>

        <Card padding="lg">
          <div key={step} style={{ animation: "fadeIn 0.2s ease" }}>

            {step === 1 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(1, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q1.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q1.help}</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="q1">{t.q.q1.label}</label>
                <textarea id="q1" rows={4} autoFocus
                  placeholder={t.q.q1.placeholder}
                  value={draft.hauptaufgabe ?? ""}
                  onChange={(e) => set("hauptaufgabe", e.target.value)}
                  className={`${inputBase} resize-none`}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(2, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-5">{t.q.q2.title}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(["taeglich", "woechentlich", "monatlich", "selten"] as Haeufigkeit[]).map((val) => (
                    <button key={val} onClick={() => set("haeufigkeit", val)}
                      className={`py-3.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                        draft.haeufigkeit === val
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >{t.q.q2.options[val]}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(3, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q3.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q3.help}</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="q3">
                  {t.q.q3.label} <span className="text-slate-400 font-normal">{t.common.optional}</span>
                </label>
                <textarea id="q3" rows={3} autoFocus
                  placeholder={t.q.q3.placeholder}
                  value={draft.manuelleArbeit ?? ""}
                  onChange={(e) => set("manuelleArbeit", e.target.value)}
                  className={`${inputBase} resize-none`}
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(4, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q4.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q4.help}</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="q4">
                  {t.q.q4.label} <span className="text-slate-400 font-normal">{t.common.optional}</span>
                </label>
                <textarea id="q4" rows={3} autoFocus
                  placeholder={t.q.q4.placeholder}
                  value={draft.aktuelleLoesung ?? ""}
                  onChange={(e) => set("aktuelleLoesung", e.target.value)}
                  className={`${inputBase} resize-none`}
                />
              </div>
            )}

            {step === 5 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(5, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-6">{t.q.q5.title}</h2>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => set("belastung", n)}
                      className={`flex-1 py-4 rounded-xl text-lg font-bold border transition-colors cursor-pointer ${
                        draft.belastung === n
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >{n}</button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                  <span>{t.q.q5.low}</span>
                  <span>{t.q.q5.high}</span>
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(6, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q6.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q6.help}</p>
                <div className="flex gap-3 mb-4">
                  {[true, false].map((val) => (
                    <button key={String(val)} onClick={() => set("schonGezahlt", val)}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                        draft.schonGezahlt === val
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >{val ? t.common.yes : t.common.no}</button>
                  ))}
                </div>
                {draft.schonGezahlt === true && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="q6f">{t.q.q6.followLabel}</label>
                    <input id="q6f" type="text" autoFocus
                      placeholder={t.q.q6.followPlaceholder}
                      value={draft.schonGezahltWofuer ?? ""}
                      onChange={(e) => set("schonGezahltWofuer", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 7 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(7, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q7.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q7.help}</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="q7">
                  {t.q.q7.label} <span className="text-slate-400 font-normal">{t.common.optional}</span>
                </label>
                <textarea id="q7" rows={3} autoFocus
                  placeholder={t.q.q7.placeholder}
                  value={draft.wunschtool ?? ""}
                  onChange={(e) => set("wunschtool", e.target.value)}
                  className={`${inputBase} resize-none`}
                />
              </div>
            )}

            {step === 8 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(8, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q8.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q8.help}</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="rolle">
                  {t.q.q8.rolleLabel} <span className="text-slate-400 font-normal">{t.common.optional}</span>
                </label>
                <input id="rolle" type="text" autoFocus
                  placeholder={t.q.q8.rollePlaceholder}
                  value={draft.rolle ?? ""}
                  onChange={(e) => set("rolle", e.target.value)}
                  className={inputBase}
                />
                <label className="block text-sm font-medium text-slate-700 mb-1.5 mt-4" htmlFor="branche">
                  {t.q.q8.brancheLabel} <span className="text-slate-400 font-normal">{t.common.optional}</span>
                </label>
                <input id="branche" type="text"
                  placeholder={t.q.q8.branchePlaceholder}
                  value={draft.branche ?? ""}
                  onChange={(e) => set("branche", e.target.value)}
                  className={inputBase}
                />
              </div>
            )}

            {step === 9 && (
              <div>
                <p className="text-sm font-medium text-orange-500 mb-1">{t.progress(9, TOTAL)}</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{t.q.q9.title}</h2>
                <p className="text-sm text-slate-400 mb-5">{t.q.q9.help}</p>
                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="feedback">
                  {t.q.q9.label} <span className="text-slate-400 font-normal">{t.common.optional}</span>
                </label>
                <textarea id="feedback" rows={3} autoFocus
                  placeholder={t.q.q9.placeholder}
                  value={draft.feedback ?? ""}
                  onChange={(e) => set("feedback", e.target.value)}
                  className={`${inputBase} resize-none`}
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ChevronLeft size={18} />
              {t.nav.back}
            </Button>

            {step < TOTAL ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                {t.nav.next}
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button onClick={finish} disabled={submitting}>
                {submitting ? t.nav.saving : t.nav.submit}
                <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
