jQuery(document).ready(function ($) {


  document.addEventListener("mousedown", function (e) {
    if (e.button === 1) {
      e.preventDefault();
    }
  });

  //  header menu
  $('.mobile_bar').click(function () {
    $(this).toggleClass('active');
    $('.slide-menu-section').toggleClass('open');
  });

  //  form popup 
  $('.top-select .btn_black').click(function () {
    $('.o-scroll').addClass('hide');
    $('.popup_form').addClass('open');
  });

  //  form popup 
  $('.popup_form .close').click(function () {
    $('.o-scroll').removeClass('hide');
    $('.popup_form').removeClass('open');
  });


  // Accordition
  $(document).on('click', '.accordian_trigger .acc-items .acc-title', function () {
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

//  header menu
  $('.mobile_menubar').click(function () {
    $(this).toggleClass('active');
    $('.mobile_menu_slide').toggleClass('open');
    $('.header').toggleClass('button_white');
  });
  
  // tab js
  $('.tab_header li').click(function () {
    var target = $(this).data('tab');
    $('.tab_header li').removeClass('active');
    $(this).addClass('active');
    $('.tab_inner_content .content').removeClass('show').slideUp(300);
    $('.tab_inner_content .content[data-tabcontent="' + target + '"]').addClass('show').slideDown(300);
  });

  // filter slide
  $(document).on('click', '.filter h4', function () {
    $('.filter h4').toggleClass('active');
    $(this).parent('.filter').find('.filter_option').slideToggle();
  });

// toggle list
$('.flt_heading').click(function () {
  $('.filter_tag  .flt_sub_title').slideToggle();
})

// mobile list toggle

  $('.mobile_menu_slide .top_menu li').each(function() {
    const $li = $(this);
    const $submenu = $li.children('ul');

    if ($submenu.length > 0) {
      // Append arrow span
      $('<span class="arrow"></span>').insertBefore($submenu);

      // Hide submenu initially
      $submenu.hide();

      // Click event on arrow
      $li.children('.arrow').on('click', function(e) {
        e.stopPropagation(); // prevent bubbling
        const $arrow = $(this);
        const $targetSubmenu = $arrow.siblings('ul');

        $targetSubmenu.slideToggle(200);
        $arrow.toggleClass('open');
      });
    }
  });

  // svg append
  const svgCode = `
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14"
  viewBox="0 0 18 14">
  <path 
  d="M9.4,16.866H23.939l-4.593-4.42c-.385-.371.047-.582.449-.969s.622-.8,1.007-.432l6.277,6.04a.945.945,0,0,1-.03,1.371l-6.55,6.3c-.4.387-.7-.109-.989-.391s-.808-.565-.406-.951L23.9,18.805H9.359Z"
  transform="translate(-9.359 -10.901)" fill="#282728"
  fill-rule="evenodd" />
  </svg>
`;

  document.querySelectorAll('.rounded_arrow').forEach(el => {
    el.innerHTML = svgCode;
  });

  // LocomotiveScroll
  const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
  });

// Make it global (optional)
window.locoScroll = scroll;

  // gsap
  gsap.registerPlugin(ScrollTrigger);
  const scrollContainer = document.querySelector("[data-scroll-container]");

  // header sticky
  const header = document.querySelector('.header');
  const bodyClass = document.querySelector('body');
  const stickyBar = document.querySelector('sticky-bar');
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

  if ($('#backToTop').length > 0) {
    // back to top button
    const backToTopBtn = document.getElementById("backToTop");
    // Scroll to top when button clicked
    backToTopBtn.addEventListener("click", () => {
      scroll.scrollTo(0, {
        duration: 800,
        easing: [0.25, 0.00, 0.35, 1.00]
      });
    });
  }


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
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
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
    gsap.to({
      distortionStrength
    }, {
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
        return arguments.length ?
          scroll.scrollTo(value, 0, 0) :
          scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
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

  if ($('.brands_sec').length > 0) {
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
        track, {
          x: reverse ? -totalWidth : 0
        }, {
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

  if ($('.scroll-next').length > 0) {
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

  }

  if ($('.mySwiper_video').length > 0) {
    // video swiper slider
    const iframePlayers = [];
    $('.swiper-slide iframe').each(function () {
      const player = new Vimeo.Player(this);
      iframePlayers.push(player);
    });
      // slider video
    const swiper = new Swiper('.mySwiper_video', {
      navigation: {
        nextEl: '.video_next',
        prevEl: '.video_prev',
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
  }

  if ($('.mySwiper_text').length > 0) {
    // text slider
    new Swiper(".mySwiper_text", {
      slidesPerView: 1,
      spaceBetween: 100,

      navigation: {
        nextEl: ".text_next",
        prevEl: ".text_prev",
      },
    });
  }

  if ($('.slider-single-image').length > 0) {
    // slider image 
    new Swiper(".slider-single-image", {
      navigation: {
        nextEl: ".image_next",
        prevEl: ".image_prev",
      },
    });
  }

  if ($('.circleSwiper_text').length > 0) {
    const swiper = new Swiper(".circleSwiper_text", {
      slidesPerView: 4,
      slidesPerGroup: 1,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }

  if ($('.reviews_slider').length > 0) {
    const swiper = new Swiper('.reviews_slider', {
        slidesPerView: 1,
        navigation: {
            nextEl: '.review-next',
            prevEl: '.review-prev',
        },
    });
  }
  
  if ($('.person_img_slider').length > 0) {
  new Swiper(".person_img_slider", {
      slidesPerView: 1,
      navigation: {
          nextEl: ".person-next",
          prevEl: ".person-prev",
      },

  });
  }
  // background color change
  if ($('.background-change').length > 0) {
    gsap.to(".background-change", {
      backgroundColor: "rgba(40, 39, 40, 1)", // Final solid color
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: {
        trigger: ".background-change",
        start: "top top", // when section hits top of viewport
        toggleActions: "play none none reverse",
        scroller: scrollContainer // Important: Locomotive scroll container
      }
    });
  }

  // counter animation
  if ($('.counter-animation').length > 0) {
    if($(window).width() > 767) {
      ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
          return arguments.length ?
            scroll.scrollTo(value, {
              duration: 0,
              disableLerp: true
            }) :
            scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed"
      });

      // Pin the full section
      ScrollTrigger.create({
        trigger: ".card-scroll-section",
        start: "bottom top",
        end: "bottom bottom", 
        pin: true,
        scrub: true,
          // markers: true,
        scroller: scrollContainer
      });

      // Animate each card+
      const cards = gsap.utils.toArray(".counter_card");
      cards.forEach((card, i) => {
        const countEl = card.querySelector(".count");
        const imageWrap = card.querySelector(".image");
        const target = +card.dataset.target;
        const countObj = {
          val: 0
        };

        const initialBottom = parseFloat(getComputedStyle(card).bottom);
        const endBottom = 200;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".card-scroll-section",
            start: "top top",
            end: "+=180%",
            scrub: true,
            scroller: scrollContainer,

          }
        });

        tl.to(card, {
          bottom: endBottom + "px",
          width: "20%",
          ease: "power2.out"
        }, i * 0.1);



        tl.to(imageWrap, {
          height: 0,
          opacity: 0,
          y: "100%",
          ease: "power2.inOut"
        }, i * 0.1 + 0.05);



        tl.to(countObj, {
          val: target,
          duration: 0.1,
          ease: "none",
          onUpdate: () => {
            countEl.textContent = Math.floor(countObj.val);
          }
        }, i * 0.1 + 0.1);
      });

      scroll.on("scroll", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", () => scroll.update());
      ScrollTrigger.refresh();
    }
  }

  // Connect ScrollTrigger with counter
  if ($('.counter_sec').length > 0) {
    ScrollTrigger.scrollerProxy(scrollContainer, {
      scrollTop(value) {
        return arguments.length ?
          scroll.scrollTo(value, {
            duration: 0,
            disableLerp: true
          }) :
          scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scrollContainer.style.transform ? "transform" : "fixed"
    });

    // Update ScrollTrigger on scroll
    scroll.on("scroll", ScrollTrigger.update);

    // Refresh both on load and resize
    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();

    // Counter animation logic
    document.querySelectorAll(".counter_sec").forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainer,
        start: "top center",
        once: true,
        onEnter: () => {
          section.querySelectorAll("[data-number]").forEach(counter => {
            const finalValue = parseFloat(counter.getAttribute("data-number"));
            const isFloat = finalValue % 1 !== 0;

            gsap.fromTo(counter, {
              innerText: 0
            }, {
              innerText: finalValue,
              duration: 4,
              ease: "power1.out",
              snap: {
                innerText: isFloat ? 0.1 : 1
              },
              onUpdate: function () {
                counter.innerText = isFloat ?
                  (+counter.innerText).toFixed(1) :
                  Math.floor(counter.innerText);
              }
            });
          });
        }
      });
    });
  }


  if ($('#globe_three').length > 0) {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282728); // Set scene background color here

    if($(window).width() > 601) {
      $screen_size = 50;
    }else{
      $screen_size = 20;
    }
    const camera = new THREE.PerspectiveCamera(
      $screen_size,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append canvas to your custom div
    document.getElementById("globe_three").appendChild(renderer.domElement);

    // Particle geometry
    const distance = Math.min(200, window.innerWidth / 8);
    const vertices = [];

    for (let i = 0; i < 1600; i++) {
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const phi = THREE.MathUtils.randFloatSpread(360);
      const x = distance * Math.sin(theta) * Math.cos(phi);
      const y = distance * Math.sin(theta) * Math.sin(phi);
      const z = distance * Math.cos(theta);
      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2
    });
    const particles = new THREE.Points(geometry, material);

    const renderingParent = new THREE.Group();
    renderingParent.add(particles);

    const resizeContainer = new THREE.Group();
    resizeContainer.add(renderingParent);
    scene.add(resizeContainer);

    // Mouse move interaction
    let mouseX = 0;
    let mouseY = 0;
    let myTween;

    function onMouseMove(event) {
      if (myTween) myTween.kill();
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      myTween = gsap.to(particles.rotation, {
        duration: 0.1,
        x: mouseY * -1,
        y: mouseX
      });
    }
    document.addEventListener("mousemove", onMouseMove, false);

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    // GSAP Rotation Animation
    const animProps = {
      scale: 1,
      xRot: 0,
      yRot: 0
    };

    gsap.to(animProps, {
      duration: 120,
      xRot: Math.PI * 2,
      yRot: Math.PI * 4,
      repeat: -1,
      yoyo: true,
      ease: "none",
      onUpdate: function () {
        renderingParent.rotation.set(animProps.xRot, animProps.yRot, 0);
      }
    });

    // Resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  if ($('.damaging_section').length > 0) {
    document.querySelectorAll('.fix_img img').forEach(img => {
      gsap.set(img, {
        x: '-100%',
        opacity: 0
      });
    });
    const cards = document.querySelectorAll('.office_card');
    cards.forEach(card => {
      const bg = card.querySelector('.fix_img img');

      card.addEventListener('mouseenter', () => {
        // Animate background image
        gsap.to(bg, {
          x: '0%',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        });

        // Blur other cards
        cards.forEach(c => {
          if (c !== card) {
            c.classList.add('blurred');
          } else {
            c.classList.remove('blurred');
          }
        });
      });

      card.addEventListener('mouseleave', () => {
        // Animate background image out
        gsap.to(bg, {
          x: '100%',
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(bg, {
              x: '-100%'
            });
          }
        });

        // Remove blur from all cards
        cards.forEach(c => c.classList.remove('blurred'));
      });
    });
  }

if ($('.floating-img').length > 0) {
  gsap.utils.toArray(".floating-img").forEach((img, i) => {
    gsap.fromTo(img, {
      opacity: 0,
      y: 50,
      scale: 0.8,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay: i * 0.2,
      ease: "power2.out",
    });

    gsap.to(img, {
      y: "+=15",
      duration: 3 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

});