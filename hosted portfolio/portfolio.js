
    lucide.createIcons();
    AOS.init({ duration: 1000, once: true, offset: 100 });

    setTimeout(() => {
      const preloader = document.querySelector('.preloader');
      preloader.classList.add('hide');
      setTimeout(() => preloader.style.display = 'none', 800);
    }, 2500);

    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
      const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      lucide.createIcons();
    }

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    function closeMobileMenu() {
      mobileMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    }

    const cursor = document.querySelector('.cursor');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0, outX = 0, outY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      curX += (mouseX - curX) * 0.25;
      curY += (mouseY - curY) * 0.25;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      outX += (mouseX - outX) * 0.12;
      outY += (mouseY - outY) * 0.12;
      cursorOutline.style.left = outX + 'px';
      cursorOutline.style.top = outY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const glowElements = document.querySelectorAll('.service-card, .skill-card, .stat-item, .project-card, .contact-card, .team-card, .pricing-card');
    glowElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        el.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });

    const typedElement = document.getElementById('typed-text');
    const texts = ["GHL Expert", "Web Developer", "UI/UX Designer", "Automation Pro"];
    let textIndex = 0, charIndex = 0, isDeleting = false;

    function typeAnimation() {
      const currentText = texts[textIndex];
      if (!isDeleting && charIndex < currentText.length) {
        typedElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeAnimation, 100);
      } else if (isDeleting && charIndex > 0) {
        typedElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeAnimation, 50);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeAnimation, isDeleting ? 2000 : 500);
      }
    }
    typeAnimation();

    const testimonialSwiper = new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
