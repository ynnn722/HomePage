// --- Utilities ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function openModal(modal) {
  if (!modal) return;
  modal.showModal();
  document.body.style.overflow = "hidden";
}
function closeModal(modal) {
  if (!modal) return;
  modal.close();
  document.body.style.overflow = "";
}

// --- Init ---
(() => {
  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Quote modal
  const quoteModal = $("#quoteModal");

  [
    "#openQuoteBtnTop",
    "#openQuoteBtnMobile",
    "#openQuoteBtnHero",
    "#openQuoteBtnServices",
    "#openQuoteBtnTeam",
    "#openQuoteBtnTeamBanner",
    "#openQuoteBtnContact",
    "#eventBtn"
  ].forEach((id) => {
    const btn = $(id);
    if (btn) btn.addEventListener("click", () => openModal(quoteModal));
  });

  const closeBtn = $("#closeQuoteBtn");
  if (closeBtn) closeBtn.addEventListener("click", () => closeModal(quoteModal));

  if (quoteModal) {
    quoteModal.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
  }

  // Form submit (static: mailto)
  const form = $("#quoteForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const company = (fd.get("company") || "").toString().trim();
      const phone = (fd.get("phone") || "").toString().trim();
      const message = (fd.get("message") || "").toString().trim();

      if (!company || !phone || !message) {
        alert("입력값을 확인해주세요.");
        return;
      }

      const subject = encodeURIComponent(`[견적요청] ${company}`);
      const body = encodeURIComponent(
        `회사명: ${company}\n연락처: ${phone}\n\n요청 내용:\n${message}\n`
      );

      window.location.href = `mailto:estelle0610@buildvision.co.kr?subject=${subject}&body=${body}`;
      form.reset();
      closeModal(quoteModal);
    });
  }

  // Mobile menu auto-close on link click
  const mobileMenu = $("#mobileMenu");
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }

  // ----------------------------
  // Top menu active (ScrollSpy)
  // ----------------------------
  const sectionIds = ["home", "services", "team", "growth", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const linksById = new Map();
  sectionIds.forEach((id) => {
    const links = [
        ...$$(`#siteNav a[href="#${id}"]`),
        ...$$(`#mobileMenu a[href="#${id}"]`)
    ];
    if (links.length) linksById.set(id, links);
  });

  function clearActive() {
    linksById.forEach((links) => links.forEach((a) => a.classList.remove("nav-active")));
  }

  function setActive(id) {
    clearActive();
    const links = linksById.get(id);
    if (links) links.forEach((a) => a.classList.add("nav-active"));
  }

  // 클릭 시 즉시 활성화 + URL hash 반영(기본 동작 유지)
  linksById.forEach((links, id) => {
    links.forEach((a) => {
      a.addEventListener("click", () => setActive(id));
    });
  });

  // --- ScrollSpy (stable 방식: scrollY 기준) ---
const HEADER_OFFSET = 110; // 헤더 높이 + 여유 (필요하면 90~130 사이로 조절)

function getCurrentSectionId() {
  const y = window.scrollY + HEADER_OFFSET;

  let current = sections[0]?.id || "home";
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec.id;
  }
  return current;
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    setActive(getCurrentSectionId());
    ticking = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

  // 초기 활성화
  const hash = (location.hash || "").replace("#", "");
if (sectionIds.includes(hash)) setActive(hash);
else setActive(getCurrentSectionId());
})();