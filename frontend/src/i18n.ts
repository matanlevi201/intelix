import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // Load translations from files or API
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    ns: ["common", "features", "errors"],
    defaultNS: "common",
    ignoreJSONStructure: false,
    nsSeparator: false,
    backend: { loadPath: "/locals/{{lng}}/{{ns}}.json" },
  });

export default i18n;
