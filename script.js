const dropdownMenu = document.getElementById("dropdown-menu"),
  hamburgerBtn = document.getElementById("hamburger-btn"),
  exploreBtn = document.getElementById("explore-btn"),
  inPageLinks = document.querySelectorAll("a"),
  inPageDestinations = [];

inPageLinks.forEach((link) => {
  if (document.getElementById(`${link.getAttribute("href").substring(1)}`)) {
    inPageDestinations.push(link.getAttribute("href"));
  }
});

document.body.addEventListener("click", (e) => {
  if (
    dropdownMenu.classList.contains("show") &&
    !e.target.classList.contains("hamburger-btn") &&
    !e.target.classList.contains("navlink")
  ) {
    dropdownMenu.classList.remove("show");
    hamburgerBtn.classList.remove("fa-times");
    hamburgerBtn.classList.add("fa-bars");
    hamburgerBtn.classList.remove("open");
  }
});

hamburgerBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("show");
  hamburgerBtn.classList.toggle("fa-bars");
  hamburgerBtn.classList.toggle("fa-times");
  hamburgerBtn.classList.toggle("open");
});
