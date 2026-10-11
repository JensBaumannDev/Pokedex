const loader = document.getElementById("loader");
let shownAt = performance.now();

export function showLoader() {
  if (loader.classList.contains("d-none")) shownAt = performance.now();
  loader.classList.remove("d-none", "is-leaving");
  document.body.classList.add("noscroll");
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function ensureMinimumIntroDuration() {
  const remaining = 2200 - (performance.now() - shownAt);
  if (remaining > 0) await wait(remaining);
}

async function fadeOutIntro() {
  loader.classList.add("is-leaving");
  await wait(300);
  loader.classList.add("d-none");
  document.body.classList.remove("noscroll");
}

export async function hideLoader() {
  await ensureMinimumIntroDuration();
  await fadeOutIntro();
}
