import { fetchNamedResource } from "../api/pokeapi.js";

export function languageForContent(language) {
  const normalized = typeof language === "string" ? language : "en";
  return normalized === "roomaji" ? "ja-roma" : normalized.toLowerCase();
}

export function localizedSpeciesName(species, language, fallback) {
  const code = languageForContent(language);
  return species.names.find((entry) => entry.language.name.toLowerCase() === code)?.name
    || species.names.find((entry) => entry.language.name === "en")?.name || fallback;
}

function resetApiLabels(root) {
  root.querySelectorAll("[data-resource-name]").forEach(resetApiLabel);
}

function resetApiLabel(element) {
  element.textContent = element.dataset.resourceFallback || element.dataset.resourceName;
}

function findLocalizedName(data, language) {
  return data.names?.find((entry) => entry.language.name.toLowerCase() === language)?.name;
}

async function localizeElement(element, language) {
  const { resource, resourceName } = element.dataset;
  try {
    const data = await fetchNamedResource(resource, resourceName);
    const label = findLocalizedName(data, language);
    if (label && element.isConnected) element.textContent = label;
  } catch {
    return;
  }
}

export async function localizeApiLabels(root, language) {
  if (language.toLowerCase() === "en") return resetApiLabels(root);
  const code = languageForContent(language);
  const elements = root.querySelectorAll("[data-resource][data-resource-name]");
  await Promise.all([...elements].map((element) => localizeElement(element, code)));
}
