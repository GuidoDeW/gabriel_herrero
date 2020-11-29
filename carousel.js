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

const swipeParams = (function () {
  let swipeStart = 0;
  let swipeEnd = 0;
  return {
    setSwipeStart: (startPoint) => {
      swipeStart = startPoint;
    },
    getSwipeStart: () => {
      return swipeStart;
    },
    setSwipeEnd: (endPoint) => {
      swipeEnd = endPoint;
    },
    getSwipeEnd: () => {
      return swipeEnd;
    },
  };
})();

function zoomOut() {
  carouselImg.classList.remove("zoomed");
  carouselImg.style.transform = "";
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

function openCarousel() {
  gallery.classList.add("carousel-show");
  carouselContainer.classList.add("carousel-show");
}

function closeCarousel() {
  carouselContainer.classList.remove("carousel-show");
  gallery.classList.remove("carousel-show");
  zoomOut();
}

document.body.addEventListener("click", (e) => {
  if (
    e.target === closeBtn ||
    (!carousel.contains(e.target) &&
      !e.target.classList.contains("gallery-item-text"))
  ) {
    closeCarousel();
  }
});

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

//Swipe event handler (configured for a swipe across at least 25% of viewport width)
carousel.addEventListener("touchstart", (e) => {
  if (e.target !== closeBtn && e.target !== nextBtn && e.target !== prevBtn) {
    e.preventDefault();
    swipeParams.setSwipeStart(e.touches[0].clientX);
    document.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        swipeParams.setSwipeEnd(e.changedTouches[0].clientX);
        if (
          swipeParams.getSwipeStart() - swipeParams.getSwipeEnd() >
          document.body.clientWidth / 4
        ) {
          newImg();
        }
        if (
          swipeParams.getSwipeEnd() - swipeParams.getSwipeStart() >
          document.body.clientWidth / 4
        ) {
          newImg("prev");
        }
      },
      { once: true }
    );
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
    openCarousel();
    galleryIndex.set(index);
    carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
  })
);

carouselImg.addEventListener("click", (e) => {
  if (carouselImg.classList.contains("zoomed")) {
    zoomOut();
  } else {
    carouselImg.classList.add("zoomed");

    const scale = carouselImg.naturalHeight / carouselImg.offsetHeight;
    const transX =
      e.clientX -
      ((window.innerWidth - carousel.getBoundingClientRect().width * scale) /
        2 +
        (e.clientX -
          (window.innerWidth - carousel.getBoundingClientRect().width) / 2) *
          scale);
    const transY =
      e.clientY -
      ((window.innerHeight - carousel.getBoundingClientRect().height * scale) /
        2 +
        (e.clientY -
          (window.innerHeight - carousel.getBoundingClientRect().height) / 2) *
          scale);

    carouselImg.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
  }
});
