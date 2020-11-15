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

function changeImg(callback) {
  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
  callback();
}

function newImg(direction) {
  carousel.classList.add("transparent");
  if (direction === "prev") {
    galleryIndex.current() > 0
      ? galleryIndex.decrease()
      : galleryIndex.set(imgSources.length - 1);
  } else {
    galleryIndex.current() < imgSources.length - 1
      ? galleryIndex.increase()
      : galleryIndex.reset();
  }

  setTimeout(() => {
    changeImg(() => {
      carousel.classList.remove("transparent");
    });
  }, 300);
}

function openCarousel() {
  gallery.classList.add("carousel-show");
  carouselContainer.classList.add("carousel-show");
}

function closeCarousel() {
  carouselContainer.classList.remove("carousel-show");
  gallery.classList.remove("carousel-show");
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
    carouselImg.classList.remove("zoomed");
    carouselImg.style.transform = "";
  } else {
    carouselImg.classList.add("zoomed");

    const scale = carouselImg.naturalHeight / carouselImg.offsetHeight;

    const transX =
      e.clientX <= window.innerWidth / 2
        ? (window.innerWidth -
            carousel.offsetWidth -
            (window.innerWidth - carouselImg.naturalWidth)) /
            2 -
          scale * (e.clientX - carousel.getBoundingClientRect().x)
        : (window.innerWidth -
            carousel.offsetWidth -
            (window.innerWidth - carouselImg.naturalWidth)) /
            2 -
          (e.clientX - carousel.getBoundingClientRect().x) * scale +
          carousel.offsetWidth;

    const transY =
      e.clientY <= window.innerHeight / 2
        ? (window.innerHeight -
            carousel.offsetHeight -
            (window.innerHeight - carouselImg.naturalHeight)) /
            2 -
          scale * (e.clientY + carousel.getBoundingClientRect().top)
        : (window.innerHeight -
            carousel.offsetHeight -
            (window.innerHeight - carouselImg.naturalHeight)) /
            2 -
          (e.clientY * scale - carousel.getBoundingClientRect().top) +
          carousel.offsetHeight;
    carouselImg.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
  }
});

//https://stackoverflow.com/questions/42741960/how-do-you-zoom-into-a-specific-point-no-canvas

//https://stackoverflow.com/questions/60190965/zoom-scale-at-mouse-position

//https://stackoverflow.com/questions/30002361/image-zoom-centered-on-mouse-position
//Almost correct; add contingency so img cannot move away from border (how can this be mathematically
// predicted, and how must the formula change in this case?)
/*
carouselImg.addEventListener("click", (e) => {
  if (carouselImg.classList.contains("zoomed")) {
    carouselImg.classList.remove("zoomed");
    carouselImg.style.transform = "";
  } else {
    carouselImg.classList.add("zoomed");
    const origins = carouselImg.getBoundingClientRect();
    const scale = carouselImg.naturalHeight / carouselImg.offsetHeight;
    console.log(scale);
    // const transX =
    //   (carouselImg.offsetWidth - e.clientX) * scale + e.clientX / scale;
    // const transY =
    //   (carouselImg.offsetHeight - e.clientY) * scale - e.clientY / scale;

    // const transX = (e.clientX - origins.x) * (scale - 1) + origins.x;
    // const transY = (e.clientY - origins.y) * (scale - 1) + origins.y;

    // const transX =
    //   (scale - 1) * origins.x
    // const transY =
    //   (carouselImg.offsetHeight - e.clientY) * scale + e.clientY / scale;
    // console.log(`Absolute x coordinate: ${e.clientX}`);
    // console.log(`Left offset for rendered width: ${origins.left}`);
    // console.log(`Rendered img width: ${carouselImg.offsetWidth}`);
    // console.log(`Actual img width: ${carouselImg.naturalWidth}`);
    // console.log(coordinates[0] - carouselImg.offsetWidth);

    // carouselImg.style.transform = `translateX(${
    //   (carouselImg.offsetWidth - e.clientX) * widthScale + origins.x / 2
    // }px) scale(${heightScale}, ${widthScale}) `;
    const transX =
      e.clientX <= window.innerWidth / 2
        ? (window.innerWidth -
            carousel.offsetWidth -
            (window.innerWidth - carouselImg.naturalWidth)) /
            2 -
          scale * (e.clientX - carousel.getBoundingClientRect().x)
        : (window.innerWidth -
            carousel.offsetWidth -
            (window.innerWidth - carouselImg.naturalWidth)) /
            2 -
          (e.clientX - carousel.getBoundingClientRect().x) * scale +
          carousel.offsetWidth;

    const transY =
      e.clientY <= window.innerHeight / 2
        ? (window.innerHeight -
            carousel.offsetHeight -
            (window.innerHeight - carouselImg.naturalHeight)) /
            2 -
          scale * (e.clientY - carousel.getBoundingClientRect().y)
        : (window.innerHeight -
            carousel.offsetHeight -
            (window.innerHeight - carouselImg.naturalHeight)) /
            2 -
          scale * (e.clientY - carousel.getBoundingClientRect().y) +
          carousel.offsetHeight;
    carouselImg.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
  }

  // (e.clientX - origins.x) * widthScale;
  // console.log(
  //   `Left offset after scaling: ${carouselImg.getBoundingClientRect().left}`
  // );
});
*/
