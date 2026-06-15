import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./lib/i18n";
import { Start } from "./pages/Start";
import { InterviewPage } from "./pages/Interview";
import { Danke } from "./pages/Danke";
import { Admin } from "./pages/Admin";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/danke" element={<Danke />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
