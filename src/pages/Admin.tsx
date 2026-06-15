import { Card } from "../components/Card";
import { Sheet } from "lucide-react";

// Hinweis: Diese App ist statisch (GitHub Pages). Die Umfrage-Antworten werden
// per Google Apps Script in eine Google-Tabelle geschrieben, die dir gehört.
export function Admin() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Sheet size={20} className="text-orange-500" />
          <h1 className="text-xl font-bold text-slate-900">Antworten ansehen</h1>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Alle Umfrage-Antworten landen automatisch in deiner
          <span className="font-semibold"> Google-Tabelle</span> – Tab
          <span className="font-mono text-slate-800"> „Antworten"</span>.
          Dort kannst du sie ansehen, filtern, auswerten und exportieren.
          Die Daten gehören vollständig dir; es ist kein weiterer Dienst beteiligt.
        </p>
      </Card>
    </div>
  );
}
