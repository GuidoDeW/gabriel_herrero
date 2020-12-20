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
  closeBtn = document.getElementById("carousel-close-btn"),
  navBtns = document.querySelectorAll(".carousel-btn");

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
  const eventX = e.clientX || e.changedTouches[0].clientX;
  const eventY = e.clientY || e.changedTouches[0].clientY;
  return (
    eventY >= boundaries.top &&
    eventX <= boundaries.right &&
    eventY <= boundaries.bottom &&
    eventX >= boundaries.left
  );
}
/*
function checkOverlap() {
  const carouselBoundaries = carousel.getBoundingClientRect();
  for (let i = 0; i < navBtns.length; i++) {
    const btnBoundaries = navBtns[i].getBoundingClientRect();
    if (
      !(
        btnBoundaries.top > carouselBoundaries.bottom ||
        btnBoundaries.bottom < carouselBoundaries.top ||
        btnBoundaries.right < carouselBoundaries.left ||
        btnBoundaries.left > carouselBoundaries.right
      )
    ) {
      navBtns.forEach((btn) => btn.classList.add("overlap"));
      // console.log("overlap detected");
      return;
    } else {
      // console.log("overlap removal loop ran");
      navBtns.forEach((btn) => {
        btn.classList.remove("overlap");
      });
    }
  }
}
*/

function checkOverlap() {
  const carouselBoundaries = carousel.getBoundingClientRect();
  navBtns.forEach((btn) => {
    const btnBoundaries = btn.getBoundingClientRect();
    btnBoundaries.top > carouselBoundaries.bottom ||
    btnBoundaries.bottom < carouselBoundaries.top ||
    btnBoundaries.right < carouselBoundaries.left ||
    btnBoundaries.left > carouselBoundaries.right
      ? btn.classList.remove("overlap")
      : btn.classList.add("overlap");
  });
}

function imgZoom(e) {
  if (carouselImg.classList.contains("zoomed")) {
    zoomOut();
  } else {
    carouselImg.classList.add("zoom-transition");
    carouselImg.classList.add("zoomed");
    const targetX = e.clientX || e.changedTouches[0].clientX;
    const targetY = e.clientY || e.changedTouches[0].clientY;
    const renderedDimensions = carouselImg.getBoundingClientRect();
    const scale = carouselImg.naturalHeight / carouselImg.offsetHeight;
    const transX = Math.min(
      targetX -
        ((window.innerWidth - renderedDimensions.width * scale) / 2 +
          (targetX - (window.innerWidth - renderedDimensions.width) / 2) *
            scale),
      (window.innerWidth -
        renderedDimensions.width -
        (window.innerWidth - carouselImg.naturalWidth)) /
        2
    );
    const transY = Math.min(
      targetY -
        ((window.innerHeight - renderedDimensions.height * scale) / 2 +
          (targetY - (window.innerHeight - renderedDimensions.height) / 2) *
            scale),
      (window.innerHeight -
        renderedDimensions.height -
        (window.innerHeight - carouselImg.naturalHeight)) /
        2
    );

    carouselImg.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`;
  }
}

function zoomOut(transition) {
  if (transition === "fast") {
    carouselImg.classList.remove("zoom-transition");
  }
  carouselImg.classList.remove("zoomed");
  carouselImg.style.transform = "";
}

function openCarousel(attr) {
  carouselImg.setAttribute("src", attr);
  gallery.classList.add("carousel-show");
  carouselContainer.classList.add("carousel-show");
  window.requestAnimationFrame(checkOverlap);
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
  zoomOut("fast");

  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);

  window.requestAnimationFrame(checkOverlap);
}

document.body.addEventListener("touchstart", (e) => {
  const carouselSpace = carousel.getBoundingClientRect();
  const targetSpace = e.touches[0];
  if (
    (targetSpace.clientX < carouselSpace.left ||
      targetSpace.clientX > carouselSpace.right ||
      targetSpace.clientY > carouselSpace.bottom ||
      targetSpace.clientY < carouselSpace.top) &&
    e.target !== prevBtn &&
    e.target !== nextBtn
  ) {
    closeCarousel();
  }
});

/*
carouselContainer.addEventListener("mousemove", (e) => {
  e.preventDefault();
  if (
    [...carouselNavBtns].filter((btn) => {
      return btn.classList.contains("fade-in");
    }).length === 0 &&
    !isInsideElement(e, carouselImg)
  ) {
    carouselNavBtns.forEach((btn) => {
      btn.classList.add("fade-in");
      // setTimeout(() => {
      //   btn.classList.remove("fade-in");
      // }, 600);
    });
    // setTimeout(() => {
    //   carouselNavBtns.forEach((btn) => {
    //     btn.classList.remove("fade-in");
    //   }, 300);
    // });
  }
});
*/
closeBtn.addEventListener("click", closeCarousel);

prevBtn.addEventListener("click", () => {
  newImg("prev");
});

nextBtn.addEventListener("click", newImg);

// Stop touchend form triggering click e when btns overlap
// (allow zoom on space occupied by btn)
navBtns.forEach((btn) => {
  btn.addEventListener("touchend", (e) => {
    if (btn.classList.contains("overlap")) {
      e.preventDefault();
    }
  });
});

galleryItems.forEach((item, index) =>
  item.querySelector(".gallery-item-text").addEventListener("click", () => {
    galleryIndex.set(index);
    openCarousel(imgSources[galleryIndex.current()]);
  })
);

window.addEventListener("resize", () => {
  zoomOut("fast");
  checkOverlap();
});

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
    // Remove check if e is NOT inside prevBtn or nextBtn, because
    // touch navigation on overlapping btns is cancelled below
    if (isInsideElement(e, carouselImg)) {
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
