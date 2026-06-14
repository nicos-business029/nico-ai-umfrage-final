import { useState } from "react";
import { Trash2, Download, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

interface Response {
  id: string;
  submitted_at: string;
  sprache: string;
  hauptaufgabe: string;
  haeufigkeit: string;
  manuelleArbeit: string;
  aktuelleLoesung: string;
  belastung: number;
  schonGezahlt: boolean;
  schonGezahltWofuer: string | null;
  wunschtool: string;
}

const LABELS: [keyof Response, string][] = [
  ["submitted_at", "Datum"],
  ["sprache", "Sprache"],
  ["hauptaufgabe", "F1 Nervige Aufgabe"],
  ["haeufigkeit", "F2 Häufigkeit"],
  ["manuelleArbeit", "F3 Manuelle Arbeit"],
  ["aktuelleLoesung", "F4 Aktuelle Lösung"],
  ["belastung", "F5 Belastung (1–5)"],
  ["schonGezahlt", "F6 Schon gelöst/gezahlt"],
  ["schonGezahltWofuer", "F6 Womit"],
  ["wunschtool", "F7 Wunsch-Werkzeug"],
];

const HAEUFIGKEIT_LABEL: Record<string, string> = {
  taeglich: "Täglich",
  woechentlich: "Wöchentlich",
  monatlich: "Monatlich",
  selten: "Selten",
};

export function Admin() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const login = async () => {
    setError("");
    const res = await fetch("/api/responses", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.status === 401) {
      setError("Falsches Passwort.");
      return;
    }
    const data: Response[] = await res.json();
    setToken(password);
    setResponses(data);
  };

  const deleteOne = async (id: string) => {
    await fetch(`/api/responses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setResponses((r) => r.filter((x) => x.id !== id));
    setDeleteId(null);
  };

  const exportCsv = () => {
    // Token muss im Header mit; daher per fetch + Blob statt direktem Link
    fetch("/api/responses/export.csv", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "umfrage-antworten.csv";
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });

  const fmtVal = (key: keyof Response, v: unknown): string => {
    if (v == null || v === "") return "–";
    if (key === "submitted_at") return fmtDate(String(v));
    if (key === "haeufigkeit") return HAEUFIGKEIT_LABEL[String(v)] ?? String(v);
    if (key === "sprache") return v === "en" ? "English" : "Deutsch";
    if (typeof v === "boolean") return v ? "Ja" : "Nein";
    return String(v);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-6">Admin-Bereich</h1>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="pw">Passwort</label>
          <div className="relative mb-4">
            <input
              id="pw"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button className="w-full" onClick={login}>Anmelden</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin – Antworten</h1>
            <p className="text-sm text-slate-400 mt-0.5">{responses.length} Einreichung{responses.length !== 1 ? "en" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={exportCsv}>
              <Download size={15} />
              CSV exportieren
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setToken(null); setResponses([]); setPassword(""); }}>
              <LogOut size={15} />
              Abmelden
            </Button>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card><p className="text-slate-400 text-center py-8">Noch keine Antworten vorhanden.</p></Card>
        ) : (
          <div className="space-y-3">
            {responses.map((r) => (
              <Card key={r.id} padding="sm">
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-slate-500 whitespace-nowrap">{fmtDate(r.submitted_at)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
                      {r.sprache === "en" ? "EN" : "DE"}
                    </span>
                    <span className="text-sm text-slate-700 truncate">{r.hauptaufgabe || "–"}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Details"
                    >
                      {expanded === r.id ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => setDeleteId(r.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Löschen"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {expanded === r.id && (
                  <div className="border-t border-slate-100 px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {LABELS.map(([key, label]) => (
                      <div key={key} className="bg-slate-50 rounded-xl px-3 py-2">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-sm text-slate-800 break-words">{fmtVal(key, r[key])}</p>
                      </div>
                    ))}
                    <div className="bg-slate-50 rounded-xl px-3 py-2 sm:col-span-2">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">ID</p>
                      <p className="text-xs text-slate-400 font-mono">{r.id}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Antwort löschen?</h3>
            <p className="text-sm text-slate-500 mb-6">Diese Einreichung wird dauerhaft gelöscht.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>Abbrechen</Button>
              <Button variant="danger" className="flex-1" onClick={() => deleteOne(deleteId)}>Löschen</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
