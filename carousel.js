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
  const elementCoordinates = element.getBoundingClientRect();
  if (
    (e.changedTouches[0].clientY || e.clientY) >= elementCoordinates.top &&
    (e.changedTouches[0].clientX || e.clientX) <= elementCoordinates.right &&
    (e.changedTouches[0].clientY || e.clientY) <= elementCoordinates.bottom &&
    (e.changedTouches[0].clientX || e.clientX) >= elementCoordinates.left
  ) {
    return true;
  }
}

function imgZoom(e) {
  if (carouselImg.classList.contains("zoomed")) {
    zoomOut();
  } else {
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

function openCarousel() {
  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
  gallery.classList.add("carousel-show");
  carouselContainer.classList.add("carousel-show");
}

function closeCarousel() {
  carouselContainer.classList.remove("carousel-show");
  gallery.classList.remove("carousel-show");
  zoomOut();
}

function newImg(direction) {
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

nextBtn.addEventListener("click", () => {
  newImg();
});

galleryItems.forEach((item, index) =>
  item.querySelector(".gallery-item-text").addEventListener("click", () => {
    galleryIndex.set(index);
    // carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
    openCarousel();
  })
);

document.body.addEventListener("keydown", (e) => {
  if (carouselContainer.classList.contains("carousel-show")) {
    if (e.key === 39 || e.keyCode === 39) {
      newImg();
    }

    if (e.key === 37 || e.keyCode === 37) {
      newImg("prev");
    }

    if (e.key === 27 || e.keyCode === 27) {
      closeCarousel();
    }
  }
});

// Disable swipe while zoomed in? (Or zoom out on swipe on zoomed img, then browse on swipe on normal img)
document.addEventListener("touchend", (e) => {
  if (carouselContainer.classList.contains("carousel-show")) {
    if (isInsideElement(e, carousel)) {
      if (carouselImg.classList.contains("zoomed")) {
        zoomOut();
      } else {
        const firstTouch = new Date().getTime();
        document.addEventListener(
          "touchend",
          (e) => {
            const secondTouch = new Date().getTime();
            if (
              isInsideElement(e, carousel) &&
              secondTouch - firstTouch <= 300
            ) {
              imgZoom(e);
            }
          },
          { once: true }
        );
      }
    }
  }
});

//Swipe event handler (configured for a swipe across at least 25% of viewport width)
//Maybe capture vertical displacement too, to disqualify steep diagonal movements
document.addEventListener("touchstart", (e) => {
  carouselImg.classList.add("touched");
  if (carouselContainer.classList.contains("carousel-show")) {
    if (isInsideElement(e, carousel)) {
      const swipeStart = e.touches[0].clientX;
      document.addEventListener(
        "touchend",
        (e) => {
          const swipeEnd = e.changedTouches[0].clientX;
          if (swipeStart - swipeEnd > document.body.clientWidth / 4) {
            newImg();
          }
          if (swipeEnd - swipeStart > document.body.clientWidth / 4) {
            newImg("prev");
          }
        },
        { once: true }
      );
    }
  }
});

carouselImg.addEventListener("click", (e) => {
  if (!carouselImg.classList.contains("touched")) {
    imgZoom(e);
  } else {
    carouselImg.classList.remove("touched");
  }
});
