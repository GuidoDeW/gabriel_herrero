const galleryItems = document.querySelectorAll(".gallery-item"),
imgSources = Array.from(document.querySelectorAll(".gallery-img")).map((img) => { return img.attributes.src.value}),
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
    }
  }
})();

function nextImg () {
  galleryIndex.current() >  0 ? galleryIndex.decrease() : galleryIndex.set(imgSources.length - 1);
  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
}

function prevImg() {
  galleryIndex.current() <  imgSources.length - 1 ? galleryIndex.increase() : galleryIndex.reset();
  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
}

function openCarousel() {
  gallery.classList.add("carousel-show");
  carouselContainer.classList.add("carousel-show");
}

function closeCarousel() {
  carouselContainer.classList.remove("carousel-show");
  gallery.classList.remove("carousel-show");
}

document.body.addEventListener("click", (e)=> {
  if(e.target === closeBtn || (!carousel.contains(e.target) && !e.target.classList.contains("gallery-item-text"))) {
    closeCarousel();
  }
})

document.body.addEventListener("keydown", (e) => {
  if(carouselContainer.classList.contains("carousel-show")) {
    if(e.key === 39 || e.keyCode === 39) {
      nextImg();
    } 

    if(e.key === 37 || e.keyCode === 37) {
      prevImg();
    }

    if(e.key === 27 || e.keyCode === 27) {
      closeCarousel();
    }
  }
});

closeBtn.addEventListener("click", closeCarousel);

prevBtn.addEventListener("click", nextImg);

nextBtn.addEventListener("click", prevImg);

galleryItems.forEach((item, index) => item.querySelector(".gallery-item-text").addEventListener("click", ()=> {
  openCarousel();
  galleryIndex.set(index);
  carouselImg.setAttribute("src", imgSources[galleryIndex.current()]);
}));