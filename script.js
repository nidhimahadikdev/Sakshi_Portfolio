const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && mainNav.classList.contains("open")) closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 800 && mainNav.classList.contains("open")) closeMenu();
});

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".photo-card img").forEach(img => {
  img.addEventListener("error", () => img.closest(".photo-card").classList.add("broken"));
});


// Accessible full-screen photo viewer: every gallery photo opens at its natural proportions.
const galleryImages = [...document.querySelectorAll(".photo-card img")];
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Photo viewer");
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close photo viewer">×</button>
  <button class="lightbox-prev" type="button" aria-label="Previous photo">‹</button>
  <img class="lightbox-image" alt="Sakshi portfolio photograph">
  <button class="lightbox-next" type="button" aria-label="Next photo">›</button>
  <div class="lightbox-caption"></div>`;
document.body.appendChild(lightbox);
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
let activePhoto = 0;
let previousFocus = null;
const availablePhotos = () => galleryImages.filter(img => !img.closest(".photo-card").classList.contains("broken"));
function showPhoto(index) {
  const photos = availablePhotos();
  if (!photos.length) return;
  activePhoto = (index + photos.length) % photos.length;
  const img = photos[activePhoto];
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = `${String(activePhoto + 2).padStart(2, "0")} / ${photos.length + 1}`;
}
function openPhoto(img) {
  previousFocus = document.activeElement;
  const photos = availablePhotos();
  showPhoto(photos.indexOf(img));
  lightbox.classList.add("open");
  document.body.classList.add("lightbox-open");
  lightbox.querySelector(".lightbox-close").focus();
}
function closePhoto() {
  lightbox.classList.remove("open");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
  if (previousFocus) previousFocus.focus();
}
galleryImages.forEach(img => {
  const card = img.closest(".photo-card");
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open ${img.alt}`);
  card.addEventListener("click", () => openPhoto(img));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPhoto(img); }
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", closePhoto);
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(activePhoto - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(activePhoto + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closePhoto(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closePhoto();
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});
