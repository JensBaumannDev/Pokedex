const API_ROOT = "https://pokeapi.co/api/v2";
const speciesCache = new Map();
const namedResourceCache = new Map();

async function fetchJson(url, signal) {
  const timeout = AbortSignal.timeout(12000);
  const requestSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const response = await fetch(url, { signal: requestSignal });
  if (!response.ok) throw new Error(`PokéAPI request failed (${response.status})`);
  return response.json();
}

export function fetchPokemonIndex() {
  return fetchJson(`${API_ROOT}/pokemon?limit=2000`);
}

export function fetchPokemon(urlOrId, signal) {
  const url = String(urlOrId).startsWith("http") ? urlOrId : `${API_ROOT}/pokemon/${urlOrId}`;
  return fetchJson(url, signal);
}

export function fetchLanguages() {
  return fetchJson(`${API_ROOT}/language?limit=100`);
}

export function fetchSpecies(id) {
  return cacheRequest(speciesCache, id, `${API_ROOT}/pokemon-species/${id}`);
}

export function fetchNamedResource(category, name) {
  const key = `${category}:${name}`;
  return cacheRequest(namedResourceCache, key, `${API_ROOT}/${category}/${name}`);
}

function cacheRequest(cache, key, url) {
  if (cache.has(key)) return cache.get(key);
  const request = fetchJson(url).catch((error) => evictFailedRequest(cache, key, request, error));
  cache.set(key, request);
  return request;
}

function evictFailedRequest(cache, key, request, error) {
  if (cache.get(key) === request) cache.delete(key);
  throw error;
}
