jQuery(document).ready(function ($) {


  document.addEventListener("mousedown", function (e) {
    if (e.button === 1) {
      e.preventDefault();
    }
  });





  // Accordition
  $(document).on('click', '.accordian_sec .acc-items .acc-title', function () {
    if ($(this).hasClass('active')) {
      $(this).parents('.acc-items').find('.acc-content').slideUp();
      $('.acc-title').removeClass('active');
    } else {
      $('.acc-content').slideUp();
      $('.acc-title').removeClass('active');
      $(this).addClass('active');
      $(this).parents('.acc-items').find('.acc-content').slideDown();
    }
  });

  // svg append
  const svgCode = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14"
  viewBox="0 0 18 14">
  <path id="Path_53" data-name="Path 53"
  d="M9.4,16.866H23.939l-4.593-4.42c-.385-.371.047-.582.449-.969s.622-.8,1.007-.432l6.277,6.04a.945.945,0,0,1-.03,1.371l-6.55,6.3c-.4.387-.7-.109-.989-.391s-.808-.565-.406-.951L23.9,18.805H9.359Z"
  transform="translate(-9.359 -10.901)" fill="#282728"
  fill-rule="evenodd" />
  </svg>
`;

  document.querySelectorAll('.rounded_arrow').forEach(el => {
    el.innerHTML = svgCode;
  });


  // tab js
  $('.tab_header li').click(function () {
    var target = $(this).data('tab');
    $('.tab_header li').removeClass('active');
    $(this).addClass('active');

    $('.tab_inner_content .content').removeClass('show').slideUp(300);

    $('.tab_inner_content .content[data-tabcontent="' + target + '"]').addClass('show').slideDown(300);
  });


  //  text slider

  new Swiper(".mySwiper_text", {
    slidesPerView: 1,
    spaceBetween: 100,
    navigation: {
      nextEl: ".text-next",
      prevEl: ".text-prev",
    },

  });
  
  new Swiper(".reviews_slider", {
    slidesPerView: 1,
   

    navigation: {
      nextEl: ".text-next",
      prevEl: ".text-prev",
    },

  });

   
  //   video slider

  const iframePlayers = [];
  $('.swiper-slide iframe').each(function () {
    const player = new Vimeo.Player(this);
    iframePlayers.push(player);
  });

  const swiper = new Swiper('.mySwiper_video', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      init: function () {
        iframePlayers.forEach(p => p.pause());
        iframePlayers[0].play();
      },
      slideChange: function () {
        iframePlayers.forEach(p => p.pause());

        const activeIndex = swiper.activeIndex;
        if (iframePlayers[activeIndex]) {
          iframePlayers[activeIndex].play();
        }
      }
    }
  });
     
$('.flt_heading').click(function () {
  $('.filter_tag  .flt_sub_title').slideToggle();
})


  // LocomotiveScroll
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
  });

  // gsap
  gsap.registerPlugin(ScrollTrigger);

  // header sticky
  const header = document.querySelector('.header');
  const bodyClass = document.querySelector('body');
  scroll.on('scroll', (args) => {
    const scrollY = args.scroll.y;

    if (scrollY > 100) {
      header.classList.add('sticky');
      bodyClass.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
      bodyClass.classList.remove('sticky');
    }
  });

  // back to top button
  const backToTopBtn = document.getElementById("backToTop");
  // Scroll to top when button clicked
  backToTopBtn.addEventListener("click", () => {
    scroll.scrollTo(0, {
      duration: 800,
      easing: [0.25, 0.00, 0.35, 1.00]
    });
  });


  if ($('#threejs-container').length > 0) {
    // three js canva
    const container = document.getElementById('threejs-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x747474); // Black background
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 80, 80);
    const material = new THREE.MeshBasicMaterial({
      color: 0x958e84,
      wireframe: true
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const simplex = new SimplexNoise();
    const basePositions = geometry.attributes.position.array.slice();
    let distortionStrength = 0.15;

    // Vertex distortion
    function distortVertices(time) {
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < pos.length; i += 3) {
        const ox = basePositions[i];
        const oy = basePositions[i + 1];
        const oz = basePositions[i + 2];

        const n = simplex.noise4D(ox * 1.5, oy * 1.5, oz * 1.5, time * 0.0008);
        const normal = new THREE.Vector3(ox, oy, oz).normalize();

        const dx = ox + normal.x * n * distortionStrength;
        const dy = oy + normal.y * n * distortionStrength;
        const dz = oz + normal.z * n * distortionStrength;

        if (!isNaN(dx) && !isNaN(dy) && !isNaN(dz)) {
          pos[i] = dx;
          pos[i + 1] = dy;
          pos[i + 2] = dz;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeBoundingSphere(); // Safe now
    }
    function animate(time) {
      requestAnimationFrame(animate);
      distortVertices(time);
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;
      renderer.render(scene, camera);
    }

    // Animate distortion strength using GSAP
    gsap.to({ distortionStrength }, {
      distortionStrength: 0.3,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      onUpdate: function () {
        distortionStrength = this.targets()[0].distortionStrength;
      }
    });

    animate();

    // Responsive resizing
    window.addEventListener('resize', () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

  }

  if ($('#services_card_hover').length > 0) {
    const card_services = document.getElementById('services_card_hover');
    let lastX = 0;
    card_services.addEventListener('mousemove', (e) => {
      const currentX = e.clientX;
      // Determine direction
      if (currentX > lastX) {
        card_services.classList.remove('hover-left');
        card_services.classList.add('hover-right');
      } else {
        card_services.classList.remove('hover-right');
        card_services.classList.add('hover-left');
      }
      lastX = currentX;
    });

    card_services.addEventListener('mouseleave', () => {
      card_services.classList.remove('hover-left', 'hover-right');
    });

  }

  if (document.getElementById("logoTrack")) {
    const track = document.getElementById("logoTrack");
    const logos = Array.from(track.children);
    const scroller = document.querySelector("[data-scroll-container]");

    // ===== SCROLLTRIGGER PROXY FOR LOCOMOTIVE =====
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        return arguments.length
          ? scroll.scrollTo(value, 0, 0)
          : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0, left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scroller.style.transform ? "transform" : "fixed"
    });

    scroll.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();

    // ===== WAIT FOR IMAGES IF NEEDED =====
    window.addEventListener("load", () => {
      const group = document.createElement("div");
      group.style.display = "flex";
      logos.forEach(logo => group.appendChild(logo.cloneNode(true)));
      track.innerHTML = "";
      track.appendChild(group);

      const groupWidth = group.offsetWidth;
      const repeatCount = Math.ceil(window.innerWidth * 2 / groupWidth);

      for (let i = 0; i < repeatCount; i++) {
        track.appendChild(group.cloneNode(true));
      }

      // ===== MARQUEE =====
      const marquee = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
        invalidateOnRefresh: false
      });

      // ===== DIRECTION CHANGE ON SCROLL =====
      let currentDir = 1;
      ScrollTrigger.create({
        trigger: ".logo-marquee",
        scroller: scroller,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const dir = self.direction;
          if (dir !== currentDir) {
            marquee.timeScale(dir);
            currentDir = dir;
          }
        }
      });
    });
  }


  if($('.brands_sec').lenght>0){


  // Marquee slider

  function setupMarquee(trackSelector, duration = 20, reverse = false) {
    const track = document.querySelector(trackSelector);
    const wrapper = track.parentElement;

    const originalLogos = [...track.children];
    const logoGroup = document.createElement('div');
    logoGroup.classList.add('logo-group');
    logoGroup.style.display = 'flex';
    logoGroup.style.gap = getComputedStyle(track).gap || '80px';

    originalLogos.forEach((logo) => {
      logoGroup.appendChild(logo.cloneNode(true));
    });

    track.innerHTML = ''; // Clear original
    track.appendChild(logoGroup);

    // Append enough logo groups to overflow wrapper width
    const groupWidth = logoGroup.offsetWidth;
    const wrapperWidth = wrapper.offsetWidth;
    const clonesNeeded = Math.ceil(wrapperWidth * 2 / groupWidth); // extra for smooth loop

    for (let i = 0; i < clonesNeeded; i++) {
      track.appendChild(logoGroup.cloneNode(true));
    }

    // Final width
    const totalWidth = track.scrollWidth / 2;

    // Animate
    gsap.fromTo(
      track,
      { x: reverse ? -totalWidth : 0 },
      {
        x: reverse ? 0 : -totalWidth,
        duration: duration,
        ease: "linear",
        repeat: -1
      }
    );
  }


  setupMarquee("#marqueeRow1", 30, true);
  setupMarquee("#marqueeRow2", 30, false);
  setupMarquee("#marqueeRow3", 30, true);
  }

  document.querySelectorAll('.scroll-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentSection = btn.closest('[data-scroll-section]');
      if (!currentSection) return;

      let nextSection = currentSection.nextElementSibling;

      // Find the next data-scroll-section
      while (nextSection && !nextSection.hasAttribute('data-scroll-section')) {
        nextSection = nextSection.nextElementSibling;
      }

      if (nextSection) {
        scroll.scrollTo(nextSection); // 👈 Locomotive scroll
      }
    });
  });






});