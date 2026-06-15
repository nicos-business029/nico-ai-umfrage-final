import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "de" | "en";

const de = {
  langName: "Deutsch",
  common: { yes: "Ja", no: "Nein", optional: "(optional)", required: "* Pflichtfeld" },
  nav: {
    back: "Zurück",
    next: "Weiter",
    submit: "Absenden",
    saving: "Wird gespeichert …",
  },
  progress: (n: number, total: number) => `Frage ${n} von ${total}`,
  start: {
    eyebrow: "Herzlich willkommen",
    title: "Schön, dass du dabei bist",
    intro: [
      "Ich entwickle neue Werkzeuge, die Menschen im Arbeitsalltag wirklich entlasten sollen – und dafür möchte ich zuerst verstehen, was dich tatsächlich aufhält, nervt oder unnötig Energie kostet.",
      "Deine ehrlichen Antworten helfen mir herauszufinden, welche Probleme sich wirklich zu lösen lohnen. Es gibt dabei keine richtigen oder falschen Antworten – nur deine Sicht zählt.",
    ],
    meta: "8 Fragen · ca. 5 Minuten · komplett anonym",
    langLabel: "Sprache wählen",
    privacyTitle: "Datenschutz & Anonymität",
    privacy: [
      "Die Teilnahme ist freiwillig und vollständig anonym.",
      "Es werden keine Namen, E-Mail-Adressen oder Kontaktdaten abgefragt.",
      "Gespeichert werden nur deine Antworten sowie Datum und Uhrzeit.",
      "Die Daten dienen ausschließlich der Entwicklung neuer Lösungen und werden nicht an Dritte weitergegeben.",
      "Diese Umfrage wird nur für nicht-öffentliche, private Zwecke genutzt.",
    ],
    cta: "Los geht's",
    contactPrefix: "Fragen? Schreib mir gerne:",
  },
  danke: {
    title: "Vielen Dank!",
    text: "Deine Antworten wurden gespeichert und helfen mir, bessere Lösungen für echte Probleme zu entwickeln.",
    contactPrefix: "Fragen oder Anmerkungen? Schreib mir gerne:",
  },
  q: {
    q1: {
      title: "Welche wiederkehrende Aufgabe in deinem Alltag nervt dich oder kostet dich am meisten Zeit?",
      help: "Denk an etwas Konkretes, das du immer wieder machen musst.",
      label: "Deine Antwort *",
      placeholder: "z. B. Termine manuell koordinieren, immer wieder dieselben E-Mails schreiben …",
    },
    q2: {
      title: "Wie oft beschäftigt dich das?",
      options: { taeglich: "Täglich", woechentlich: "Wöchentlich", monatlich: "Monatlich", selten: "Selten" },
    },
    q3: {
      title: "Was machst du noch von Hand, obwohl es eigentlich automatisch laufen könnte?",
      help: "Excel-Tabellen, E-Mails, Copy-Paste, Erinnerungen …",
      label: "Deine Antwort",
      placeholder: "z. B. Ich übertrage jede Woche Daten per Hand von A nach B …",
    },
    q4: {
      title: "Was tust du heute dagegen – und warum reicht das nicht?",
      help: "Welche Behelfslösungen oder Tools nutzt du, obwohl sie das Problem nicht wirklich lösen?",
      label: "Deine Antwort",
      placeholder: "z. B. Ich nutze eine Vorlage, muss aber trotzdem jedes Mal alles anpassen …",
    },
    q5: {
      title: "Wie sehr stört dich dieses Problem?",
      low: "Kaum",
      high: "Extrem",
    },
    q6: {
      title: "Hast du schon einmal versucht, das mit einem Tool oder mit Geld zu lösen?",
      help: "Software, App, Dienstleister, Berater – egal was.",
      followLabel: "Womit?",
      followPlaceholder: "z. B. eine App, ein Freelancer, ein Abo …",
    },
    q7: {
      title: "Stell dir vor, es gäbe ein Werkzeug, das dir genau eine Sache abnimmt – was wäre das?",
      help: "Träum ruhig – keine Idee ist zu groß oder zu klein.",
      label: "Deine Antwort",
      placeholder: "z. B. Etwas, das meine E-Mails automatisch vorsortiert und beantwortet …",
    },
    q8: {
      title: "Zum Schluss: Wer bist du beruflich?",
      help: "Das hilft mir, die Antworten besser einzuordnen – es bleibt vollständig anonym.",
      rolleLabel: "Deine Rolle / Position",
      rollePlaceholder: "z. B. Vertriebsleiter, Sachbearbeiterin, Geschäftsführer …",
      brancheLabel: "Deine Branche",
      branchePlaceholder: "z. B. Maschinenbau, Handwerk, IT, Einzelhandel …",
    },
  },
};

const en: typeof de = {
  langName: "English",
  common: { yes: "Yes", no: "No", optional: "(optional)", required: "* required" },
  nav: {
    back: "Back",
    next: "Next",
    submit: "Submit",
    saving: "Saving …",
  },
  progress: (n: number, total: number) => `Question ${n} of ${total}`,
  start: {
    eyebrow: "Welcome",
    title: "Glad you're here",
    intro: [
      "I'm building new tools designed to genuinely make people's workday easier – and to do that, I first want to understand what actually slows you down, frustrates you, or drains your energy.",
      "Your honest answers help me figure out which problems are truly worth solving. There are no right or wrong answers here – only your perspective matters.",
    ],
    meta: "8 questions · about 5 minutes · completely anonymous",
    langLabel: "Choose language",
    privacyTitle: "Privacy & anonymity",
    privacy: [
      "Participation is voluntary and completely anonymous.",
      "No names, email addresses or contact details are collected.",
      "Only your answers and the date and time are stored.",
      "The data is used solely to develop new solutions and is never shared with third parties.",
      "This survey is used strictly for non-public, private purposes.",
    ],
    cta: "Let's go",
    contactPrefix: "Questions? Feel free to reach out:",
  },
  danke: {
    title: "Thank you!",
    text: "Your answers have been saved and help me build better solutions for real problems.",
    contactPrefix: "Questions or comments? Feel free to reach out:",
  },
  q: {
    q1: {
      title: "Which recurring task in your day annoys you or eats up the most time?",
      help: "Think of something concrete you have to do again and again.",
      label: "Your answer *",
      placeholder: "e.g. coordinating appointments by hand, writing the same emails over and over …",
    },
    q2: {
      title: "How often do you deal with this?",
      options: { taeglich: "Daily", woechentlich: "Weekly", monatlich: "Monthly", selten: "Rarely" },
    },
    q3: {
      title: "What do you still do manually, even though it could run automatically?",
      help: "Spreadsheets, emails, copy-paste, reminders …",
      label: "Your answer",
      placeholder: "e.g. I copy data from A to B by hand every week …",
    },
    q4: {
      title: "What do you do about it today – and why isn't that enough?",
      help: "Which workarounds or tools do you use, even though they don't really solve the problem?",
      label: "Your answer",
      placeholder: "e.g. I use a template, but I still have to adjust everything every time …",
    },
    q5: {
      title: "How much does this problem bother you?",
      low: "Barely",
      high: "Extremely",
    },
    q6: {
      title: "Have you ever tried to solve this with a tool or by paying for it?",
      help: "Software, an app, a service, a consultant – anything.",
      followLabel: "What with?",
      followPlaceholder: "e.g. an app, a freelancer, a subscription …",
    },
    q7: {
      title: "Imagine there were a tool that took just one thing off your plate – what would it be?",
      help: "Dream freely – no idea is too big or too small.",
      label: "Your answer",
      placeholder: "e.g. something that automatically sorts and answers my emails …",
    },
    q8: {
      title: "Finally: what's your professional role?",
      help: "This helps me put the answers into context – it stays completely anonymous.",
      rolleLabel: "Your role / position",
      rollePlaceholder: "e.g. sales manager, clerk, managing director …",
      brancheLabel: "Your industry",
      branchePlaceholder: "e.g. manufacturing, trades, IT, retail …",
    },
  },
};

export const translations = { de, en };
export type Translation = typeof de;

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = window.localStorage.getItem("survey_lang");
    return saved === "en" ? "en" : "de";
  });

  const setLang = useCallback((l: Lang) => {
    window.localStorage.setItem("survey_lang", l);
    setLangState(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export const CONTACT_EMAIL = "nicolas.monschau@gmx.de";
export const CONTACT_NAME = "Nico Monschau";
