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

function imgZoom(e) {
  if (carouselImg.classList.contains("zoomed")) {
    zoomOut();
  } else {
    carouselImg.classList.add("zoom-transition");
    carouselImg.classList.add("zoomed");
    const scale = carouselImg.naturalHeight / carouselImg.offsetHeight;
    const transX =
      (e.clientX || e.changedTouches[0].clientX) -
      ((window.innerWidth - carousel.getBoundingClientRect().width * scale) /
        2 +
        ((e.clientX || e.changedTouches[0].clientX) -
          (window.innerWidth - carousel.getBoundingClientRect().width) / 2) *
          scale);
    const transY =
      (e.clientY || e.changedTouches[0].clientY) -
      ((window.innerHeight - carousel.getBoundingClientRect().height * scale) /
        2 +
        ((e.clientY || e.changedTouches[0].clientY) -
          (window.innerHeight - carousel.getBoundingClientRect().height) / 2) *
          scale);

    carouselImg.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
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

// Disable swipe while zoomed in? (Or zoom out on swipe on zoomed img, then browse on swipe on normal img)
document.addEventListener("touchend", (e) => {
  if (carouselContainer.classList.contains("carousel-show")) {
    if (
      isInsideElement(e, carousel) &&
      !isInsideElement(e, prevBtn) &&
      !isInsideElement(e, nextBtn)
    ) {
      const firstTouch = new Date().getTime();
      document.addEventListener(
        "touchend",
        (e) => {
          const secondTouch = new Date().getTime();
          if (isInsideElement(e, carousel) && secondTouch - firstTouch <= 300) {
            imgZoom(e);
          }
        },
        { once: true }
      );
    }
  }
});

//Swipe event handler (configured for a swipe across at least 25% of viewport width)
//Maybe capture vertical displacement too, to disqualify steep diagonal movements
document.addEventListener("touchstart", (e) => {
  carouselImg.classList.add("touched");
  if (isInsideElement(e, carousel)) {
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
