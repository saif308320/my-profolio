const swiper = new Swiper('.integration-slider', {
  slidesPerView: 5,
  spaceBetween: 30,
  loop: true,
  speed: 3000, // jitni zyada speed, utna slow silsile se chalega
  autoplay: {
    delay: 0, // rukega nahi
    disableOnInteraction: false,
  },
  freeMode: true,
  freeModeMomentum: false,
  allowTouchMove: false, // user swipe na kar sake, bas automatic chale
  breakpoints: {
    0: { slidesPerView: 2 },
    480: { slidesPerView: 3 },
    768: { slidesPerView: 4 },
    1024: { slidesPerView: 5 }
  }
});
