const header = document.querySelector(".header");
let idleTimer;
let previousScrollY = window.scrollY;

function showHeader() {
  header.classList.remove("is-hidden");
}

function hideHeader() {
  header.classList.add("is-hidden");
}

function handleScroll() {
  const currentScrollY = Math.max(0, window.scrollY);
  const difference = currentScrollY - previousScrollY;
  previousScrollY = currentScrollY;
  if (currentScrollY <= 8) return showAtTop();
  if (difference < -1) return showOnUpwardScroll();
  if (difference > 1) hideUntilIdle();
}

function showAtTop() {
  window.clearTimeout(idleTimer);
  showHeader();
}

function showOnUpwardScroll() {
  window.clearTimeout(idleTimer);
  showHeader();
}

function hideUntilIdle() {
  hideHeader();
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(showHeader, 350);
}

function keepHeaderVisible() {
  window.clearTimeout(idleTimer);
  showHeader();
}

export function initializeHeader() {
  window.addEventListener("scroll", handleScroll, { passive: true });
  header.addEventListener("focusin", keepHeaderVisible);
}
