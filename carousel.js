const galleryItems = document.querySelectorAll(".gallery-item"),
  imgSources = Array.from(document.querySelectorAll(".gallery-img")).map(
    (img) => {
      return img.attributes.src.value;
    }
  ),
  gallery = document.getElementById("gallery"),
  carouselContainer = document.getElementById("carousel-container"),
  carousel = document.getElementById("img-carousel"),
  carouselImg = document.getElementById("carousel-img"),
  prevBtn = document.getElementById("carousel-prev-btn"),
  nextBtn = document.getElementById("carousel-next-btn"),
  closeBtn = document.getElementById("carousel-close-btn");

const galleryIndex = (function () {
  let currentImage = 0;
  return {
    set: (num) => {
      currentImage = num;
    },
    decrease: () => {
      currentImage--;
    },
    increase: () => {
      currentImage++;
    },
    reset: () => {
      currentImage = 0;
    },
    current: () => {
      return currentImage;
    },
  };
})();

function isInsideElement(e, element) {
  const boundaries = element.getBoundingClientRect();
  return (
    (e.changedTouches[0].clientY || e.clientY) >= boundaries.top &&
    (e.changedTouches[0].clientX || e.clientX) <= boundaries.right &&
    (e.changedTouches[0].clientY || e.clientY) <= boundaries.bottom &&
    (e.changedTouches[0].clientX || e.clientX) >= boundaries.left
  );
}

//Clues:
// -zoom fails entirely  on very small windows - formula only seems to work upwards from a certain size
// - Math.min has the same effect as current code (see transX in transform), but inverts the problem: the utter left
// border of the img cannot be brought into view
// -Try replacing the distance caluclation with carouselImg.getBoundingClientRect().left (although these should be numerically identical)
// -Scale is the only variable in which the window plays no part whatsoever (it is simply the ratio of the real height to the rendered height),
// so this might be the problem (the scale is a factor in the translation, so it might not suit the window dimensions).
// The key might be to calculate some sort of maximal ratio the img may have to the window, and zoom based on that rather than
// stictly based on natural dimensions
// - the swan img produces  no problem
function imgZoom(e) {
  if (carouselImg.classList.contains("zoomed")) {
    zoomOut();
  } else {
    carouselImg.classList.add("zoom-transition");
    carouselImg.classList.add("zoomed");
    const scale = carouselImg.naturalHeight / carouselImg.offsetHeight;
    const transX =
      (e.clientX || e.changedTouches[0].clientX) -
      ((window.innerWidth - carouselImg.getBoundingClientRect().width * scale) /
        2 +
        ((e.clientX || e.changedTouches[0].clientX) -
          (window.innerWidth - carouselImg.getBoundingClientRect().width) / 2) *
          scale);
    const transY =
      (e.clientY || e.changedTouches[0].clientY) -
      ((window.innerHeight -
        carouselImg.getBoundingClientRect().height * scale) /
        2 +
        ((e.clientY || e.changedTouches[0].clientY) -
          (window.innerHeight - carouselImg.getBoundingClientRect().height) /
            2) *
          scale);

    console.log(transX);
    console.log(transX / scale);
    console.log(carouselImg.getBoundingClientRect().left);
    console.log(carouselImg.getBoundingClientRect().left * scale);

    carouselImg.style.transform = `translate(${
      transX > carouselImg.getBoundingClientRect().left
        ? transX - (transX - carouselImg.getBoundingClientRect().left) / scale
        : transX
    }px, ${transY}px) scale(${scale})`;
  }
}

function zoomOut() {
  carouselImg.classList.remove("zoomed");
  carouselImg.style.transform = "";
}

function openCarousel(attr) {
  carouselImg.setAttribute("src", attr);
  gallery.classList.add("carousel-show");
  carouselContainer.classList.add("carousel-show");
}

function closeCarousel() {
  carouselContainer.classList.remove("carousel-show");
  gallery.classList.remove("carousel-show");
  zoomOut();
}

function newImg(direction) {
  carouselImg.classList.remove("zoom-transition");
  if (direction === "prev") {
    galleryIndex.current() > 0
      ? galleryIndex.decrease()
      : galleryIndex.set(imgSources.length - 1);
  } else {
    galleryIndex.current() < imgSources.length - 1
      ? galleryIndex.increase()
      : galleryIndex.reset();
  }
  zoomOut();
  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
}

document.body.addEventListener("click", (e) => {
  if (e.target === closeBtn || e.target === carouselContainer) {
    closeCarousel();
  }
});

closeBtn.addEventListener("click", closeCarousel);

prevBtn.addEventListener("click", () => {
  newImg("prev");
});

nextBtn.addEventListener("click", newImg);

galleryItems.forEach((item, index) =>
  item.querySelector(".gallery-item-text").addEventListener("click", () => {
    galleryIndex.set(index);
    openCarousel(imgSources[galleryIndex.current()]);
  })
);

document.body.addEventListener("keydown", (e) => {
  if (carouselContainer.classList.contains("carousel-show")) {
    if (e.key === 39 || e.keyCode === 39) {
      newImg();
    } else if (e.key === 37 || e.keyCode === 37) {
      newImg("prev");
    } else if (e.key === 27 || e.keyCode === 27) {
      closeCarousel();
    }
  }
});

document.addEventListener("touchend", (e) => {
  if (carouselContainer.classList.contains("carousel-show")) {
    if (
      isInsideElement(e, carouselImg) &&
      !isInsideElement(e, prevBtn) &&
      !isInsideElement(e, nextBtn)
    ) {
      const firstTouch = new Date().getTime();
      document.addEventListener(
        "touchend",
        (e) => {
          const secondTouch = new Date().getTime();
          if (
            isInsideElement(e, carouselImg) &&
            secondTouch - firstTouch <= 300
          ) {
            imgZoom(e);
          }
        },
        { once: true }
      );
    }
  }
});

document.addEventListener("touchstart", (e) => {
  carouselImg.classList.add("touched");
  if (isInsideElement(e, carouselImg)) {
    const swipeStartX = e.touches[0].clientX;
    document.addEventListener(
      "touchend",
      (e) => {
        const swipeEndX = e.changedTouches[0].clientX;
        if (swipeStartX - swipeEndX > document.body.clientWidth / 4) {
          carouselImg.classList.contains("zoomed") ? zoomOut() : newImg();
        } else if (swipeEndX - swipeStartX > document.body.clientWidth / 4) {
          carouselImg.classList.contains("zoomed") ? zoomOut() : newImg("prev");
        }
      },
      { once: true }
    );
  }
});

carouselImg.addEventListener("click", (e) => {
  carouselImg.classList.contains("touched")
    ? carouselImg.classList.remove("touched")
    : imgZoom(e);
});
