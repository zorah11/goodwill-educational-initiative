const menu = document.querySelector(".menu"),
  nav = document.querySelector(".nav");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
});
document.querySelectorAll(".nav a").forEach((a) =>
  a.addEventListener("click", () => {
    nav?.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }),
);
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const gallery = document.querySelector("#community-gallery");
if (gallery) {
  const count = Number(gallery.dataset.galleryCount || 0);
  const initialLimit = 18;
  let visibleLimit = initialLimit;
  let filter = "all";
  const cards = [];

  for (let index = 1; index <= count; index += 1) {
    const number = String(index).padStart(3, "0");
    const figure = document.createElement("figure");
    figure.dataset.featured = index <= 12 ? "true" : "false";
    figure.innerHTML = `<img src="../images/gallery/goodwill-${number}.jpeg" alt="Goodwill Educational Initiative community photograph ${index}" loading="lazy"><figcaption>Community moment ${number}</figcaption>`;
    gallery.appendChild(figure);
    cards.push(figure);
  }

  const moreButton = document.querySelector(".gallery-more");
  const refreshGallery = () => {
    const matching = cards.filter(
      (card) => filter === "all" || card.dataset.featured === "true",
    );
    cards.forEach((card) => (card.hidden = true));
    matching.slice(0, visibleLimit).forEach((card) => (card.hidden = false));
    if (moreButton) moreButton.hidden = visibleLimit >= matching.length;
  };

  document.querySelectorAll("[data-gallery-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.galleryFilter;
      visibleLimit = filter === "featured" ? 12 : initialLimit;
      document
        .querySelectorAll("[data-gallery-filter]")
        .forEach((item) => item.classList.toggle("active", item === button));
      refreshGallery();
    });
  });
  moreButton?.addEventListener("click", () => {
    visibleLimit += 18;
    refreshGallery();
  });

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Expanded community photograph");
  lightbox.innerHTML = `<button type="button" aria-label="Close photograph">×</button><img alt="Expanded Goodwill community photograph">`;
  document.body.appendChild(lightbox);
  const expandedImage = lightbox.querySelector("img");
  const closeLightbox = () => lightbox.classList.remove("open");
  lightbox.querySelector("button").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
  cards.forEach((card) =>
    card.addEventListener("click", () => {
      expandedImage.src = card.querySelector("img").src;
      lightbox.classList.add("open");
    }),
  );
  refreshGallery();
}
