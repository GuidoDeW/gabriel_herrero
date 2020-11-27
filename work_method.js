const workMethodItems = document.querySelectorAll(".work-method-item");

workMethodItems.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("highlighted");
  });
});

document.body.addEventListener("click", (e) => {
  workMethodItems.forEach((item) => {
    if (!item.contains(e.target)) {
      item.classList.remove("highlighted");
    }
  });
});
