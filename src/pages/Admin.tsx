import { Card } from "../components/Card";
import { Database, ExternalLink } from "lucide-react";

// Hinweis: Diese App wird als statische Seite auf Netlify gehostet. Die
// Umfrage-Antworten werden über Netlify Forms gesammelt und sind direkt im
// Netlify-Dashboard einsehbar (ansehen, als CSV exportieren, einzeln löschen).
export function Admin() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg" padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-orange-500" />
          <h1 className="text-xl font-bold text-slate-900">Antworten ansehen</h1>
        </div>
        <p className="text-slate-600 mb-4 leading-relaxed">
          Die Umfrage-Antworten werden über <span className="font-semibold">Netlify Forms</span> gesammelt.
          Du findest sie in deinem Netlify-Dashboard – dort kannst du sie ansehen,
          als CSV exportieren, einzeln löschen und dir bei neuen Antworten eine
          E-Mail schicken lassen.
        </p>
        <ol className="text-sm text-slate-600 space-y-2 mb-6 list-decimal list-inside">
          <li>Auf <span className="font-medium">app.netlify.com</span> einloggen</li>
          <li>Dein Projekt öffnen</li>
          <li>Oben im Menü auf <span className="font-medium">„Forms"</span> klicken</li>
          <li>Das Formular <span className="font-mono text-slate-800">ai-umfrage</span> auswählen</li>
        </ol>
        <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer">
          <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 text-white px-5 py-3 text-sm font-medium hover:bg-orange-600 transition-colors cursor-pointer">
            Netlify-Dashboard öffnen
            <ExternalLink size={16} />
          </button>
        </a>
      </Card>
    </div>
  );
}
