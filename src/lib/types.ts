import type { Lang } from "./i18n";

export type Haeufigkeit = "taeglich" | "woechentlich" | "monatlich" | "selten";

export interface SurveyResponse {
  sprache: Lang;
  hauptaufgabe: string;       // F1
  haeufigkeit: Haeufigkeit;   // F2
  manuelleArbeit: string;     // F3
  aktuelleLoesung: string;    // F4
  belastung: number;          // F5 (1–5)
  schonGezahlt: boolean;      // F6
  schonGezahltWofuer?: string;// F6 Zusatz
  wunschtool: string;         // F7
  rolle: string;              // F8 Rolle/Position (anonym)
  branche: string;            // F8 Branche (anonym)
}
