const dropdownMenu = document.getElementById("dropdown-menu"),
  hamburgerBtn = document.getElementById("hamburger-btn"),
  exploreBtn = document.getElementById("explore-btn"),
  navBar = document.querySelector("nav"),
  header = document.getElementById("header"),
  navLinks = document.querySelectorAll(".navlink"),
  headerDiv = document.getElementById("header").querySelector("div"),
  inPageLinks = [...document.querySelectorAll("a")].filter((link) => {
    return document.getElementById(`${link.getAttribute("href").substring(1)}`);
  });

function smoothScroll(e, destination) {
  e.preventDefault();
  scroll({
    top: destination.offsetTop,
    behavior: "smooth",
  });
}

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

inPageLinks.forEach((link) => {
  const inPageLink = document.getElementById(
    `${link.getAttribute("href").substring(1)}`
  );
  if (inPageLink !== null) {
    link.addEventListener("click", (e) => {
      smoothScroll(e, inPageLink);
    });
  }
});

[...navLinks, headerDiv].forEach((element) => {
  window.addEventListener("resize", () => {
    element.getBoundingClientRect().bottom >=
    header.getBoundingClientRect().bottom
      ? element.classList.add("transparent")
      : element.classList.remove("transparent");
  });
});

window.addEventListener("resize", () => {
  header.style.minHeight =
    header.getBoundingClientRect().bottom <=
    navBar.getBoundingClientRect().bottom
      ? `${navBar.getBoundingClientRect().height}px`
      : (header.style.minHeight = "50vh");
});
