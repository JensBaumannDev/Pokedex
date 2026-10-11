import i18next from "i18next";
import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import zhHans from "./locales/zh-hans.json";
import zhHant from "./locales/zh-hant.json";

const localeResources = { en, de, fr, es, it, ja, ko, "zh-hans": zhHans, "zh-hant": zhHant };

export function getInterfaceLanguage(apiLanguage) {
  const normalizedLanguage = typeof apiLanguage === "string" ? apiLanguage : "en";
  const language = normalizedLanguage === "roomaji" ? "ja-roma" : normalizedLanguage.toLowerCase();
  if (language === "es-419") return "es";
  if (language.startsWith("ja-")) return "ja";
  return localeResources[language] ? language : "en";
}

export function translate(key, options) {
  return i18next.t(key, options);
}

export async function initializeI18n(language) {
  await i18next.init({
    lng: getInterfaceLanguage(language),
    fallbackLng: "en",
    supportedLngs: Object.keys(localeResources),
    load: "currentOnly",
    resources: Object.fromEntries(
      Object.entries(localeResources).map(([locale, translations]) => [locale, { translation: translations }]),
    ),
    interpolation: { escapeValue: true },
  });
}

export async function changeInterfaceLanguage(language) {
  await i18next.changeLanguage(getInterfaceLanguage(language));
}
