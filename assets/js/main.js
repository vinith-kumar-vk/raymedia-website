(function ($) {
    "use strict";

    $(window).on('load', function () {
        $('#preloader').addClass('loaded');
    });

    $(function () {


        /*-----------------------------------
          Mobile Menu  
        -----------------------------------*/
        $('#mobile-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: "1199",
            meanExpand: ['<i class="fas fa-angle-right"></i>'],
        });



        /*-----------------------------------
         Sidebar Toggle  
        -----------------------------------*/
        $(document).on("click", ".offcanvas__close, .offcanvas__overlay", function () {
            $(".offcanvas__info").removeClass("info-open");
            $(".offcanvas__overlay").removeClass("overlay-open");
        });
        $(document).on("click", ".sidebar__toggle", function () {
            $(".offcanvas__info").addClass("info-open");
            $(".offcanvas__overlay").addClass("overlay-open");
        });



        /*-----------------------------------
         Body Overlay 
        -----------------------------------*/
        $(document).on("click", ".body-overlay", function () {
            $(".offcanvas__area").removeClass("offcanvas-opened");
            $(".df-search-area").removeClass("opened");;
            $(".body-overlay").removeClass("opened");
        });



        /*-----------------------------------
          Sticky Header 
        -----------------------------------*/
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 250) {
                $("#header-sticky").addClass("sticky");
            } else {
                $("#header-sticky").removeClass("sticky");
            }

        });



        /*-----------------------------------
         Sticky Header Two
        -----------------------------------*/

        var windowOn = $(window);

        windowOn.on('scroll', function () {
            var scroll = windowOn.scrollTop();
            if (scroll > 100) {
                $('#header-sticky').addClass("header-sticky");
            } else {
                $('#header-sticky').removeClass("header-sticky");
            }
        });




        /*-----------------------------------
           Set Background Image & Mask   
        -----------------------------------*/
        if ($("[data-bg-src]").length > 0) {
            $("[data-bg-src]").each(function () {
                var src = $(this).attr("data-bg-src");
                $(this).css("background-image", "url(" + src + ")");
                $(this).removeAttr("data-bg-src").addClass("background-image");
            });
        }


        if ($('[data-mask-src]').length > 0) {
            $('[data-mask-src]').each(function () {
                var mask = $(this).attr('data-mask-src');
                $(this).css({
                    'mask-image': 'url(' + mask + ')',
                    '-webkit-mask-image': 'url(' + mask + ')'
                });
                $(this).addClass('bg-mask');
                $(this).removeAttr('data-mask-src');
            });
        };



        /*-----------------------------------
        Global Slider
        -----------------------------------*/
        function applyAnimationProperties() {
            $('[data-ani]').each(function () {
                var animationClass = $(this).data('ani');
                $(this).addClass(animationClass);
            });

            $('[data-ani-delay]').each(function () {
                var delay = $(this).data('ani-delay');
                $(this).css('animation-delay', delay);
            });
        }

        // Call the animation properties function
        applyAnimationProperties();

        // Function to initialize Swiper
        function initializeSwiper(sliderContainer) {
            var sliderOptions = sliderContainer.data('slider-options');

            console.log("Slider options: ", sliderOptions);

            var previousArrow = sliderContainer.find('.slider-prev');
            var nextArrow = sliderContainer.find('.slider-next');
            var paginationElement = sliderContainer.find('.slider-pagination');
            var numberedPagination = sliderContainer.find('.slider-pagination.pagi-number');

            var paginationStyle = sliderOptions['paginationType'] || 'bullets';
            var autoplaySettings = sliderOptions['autoplay'] || {
                delay: 6000,
                disableOnInteraction: false
            };

            var defaultSwiperConfig = {
                slidesPerView: 1,
                spaceBetween: sliderOptions['spaceBetween'] || 24,
                loop: sliderOptions['loop'] !== false,
                speed: sliderOptions['speed'] || 1000,
                initialSlide: sliderOptions['initialSlide'] || 0,
                centeredSlides: !!sliderOptions['centeredSlides'],
                effect: sliderOptions['effect'] || 'slide',
                fadeEffect: {
                    crossFade: true
                },
                autoplay: autoplaySettings,
                navigation: {
                    nextEl: nextArrow.length ? nextArrow.get(0) : null,
                    prevEl: previousArrow.length ? previousArrow.get(0) : null,
                },
                pagination: {
                    el: paginationElement.length ? paginationElement.get(0) : null,
                    type: paginationStyle,
                    clickable: true,
                    renderBullet: function (index, className) {
                        var bulletNumber = index + 1;
                        var formattedNumber = bulletNumber < 10 ? '0' + bulletNumber : bulletNumber;
                        if (numberedPagination.length) {
                            return '<span class="' + className + ' number">' + formattedNumber + '</span>';
                        } else {
                            return '<span class="' + className + '" aria-label="Go to Slide ' + formattedNumber + '"></span>';
                        }
                    },
                },
                on: {
                    slideChange: function () {
                        setTimeout(function () {
                            this.params.mousewheel.releaseOnEdges = false;
                        }.bind(this), 500);
                    },
                    reachEnd: function () {
                        setTimeout(function () {
                            this.params.mousewheel.releaseOnEdges = true;
                        }.bind(this), 750);
                    }
                }
            };

            var finalConfig = $.extend({}, defaultSwiperConfig, sliderOptions);
            console.log("Complete Swiper options: ", finalConfig);

            // Initialize the Swiper instance
            return new Swiper(sliderContainer.get(0), finalConfig);
        }

        // Initialize Swipers on page load
        var swiperInstances = [];
        $('.slider').each(function () {
            var sliderContainer = $(this);
            var swiperInstance = initializeSwiper(sliderContainer);
            swiperInstances.push(swiperInstance);
        });


        // Bootstrap tab show event
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var targetTab = $(e.target).attr('href');
            $(targetTab).find('.et-slider').each(function () {
                var sliderContainer = $(this);
                if (!sliderContainer[0].swiper) {
                    initializeSwiper(sliderContainer);
                } else {
                    sliderContainer[0].swiper.update();
                }
            });
        });

        // Add click event handlers for external slider arrows based on data attributes
        $(document).on('click', '[data-slider-prev], [data-slider-next]', function () {
            var targetSliderSelector = $(this).data('slider-prev') || $(this).data('slider-next');
            var targetSlider = $(targetSliderSelector);

            if (targetSlider.length) {
                var swiper = targetSlider[0].swiper;

                if (swiper) {
                    if ($(this).data('slider-prev')) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                }
            }
        });



        /*-----------------------------------
            Back to top    
        -----------------------------------*/
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 20) {
                $("#back-top").addClass("show");
            } else {
                $("#back-top").removeClass("show");
            }
        });

        $(document).on("click", "#back-top", function () {
            $("html, body").animate({ scrollTop: 0 }, 800);
            return false;
        })



        /*-----------------------------------
             MagnificPopup  view    
        -----------------------------------*/
        $(".popup-video").magnificPopup({
            type: "iframe",
            removalDelay: 260,
            mainClass: 'mfp-zoom-in',
        });

        $(".img-popup").magnificPopup({
            type: "image",
            gallery: {
                enabled: true,
            },
        });




        /*-----------------------------------
             NiceSelect     
        -----------------------------------*/
        if ($('.single-select').length) {
            $('.single-select').niceSelect();
        }



        /*-----------------------------------
           Mouse Cursor    
        -----------------------------------*/
        function mousecursor() {
            if ($("body")) {
                const e = document.querySelector(".cursor-inner"),
                    t = document.querySelector(".cursor-outer");
                let n,
                    i = 0,
                    o = !1;
                (window.onmousemove = function (s) {
                    o ||
                        (t.style.transform =
                            "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                        (e.style.transform =
                            "translate(" + s.clientX + "px, " + s.clientY + "px)"),
                        (n = s.clientY),
                        (i = s.clientX);
                }),
                    $("body").on("mouseenter", "a, .cursor-pointer", function () {
                        e.classList.add("cursor-hover");
                        t.classList.add("cursor-hover");
                    }),
                    $("body").on("mouseleave", "a, .cursor-pointer", function () {
                        ($(this).is("a") && $(this).closest(".cursor-pointer").length) ||
                            (e.classList.remove("cursor-hover"),
                                t.classList.remove("cursor-hover"));
                    }),
                    (e.style.visibility = "visible"),
                    (t.style.visibility = "visible");
            }
        }
        $(function () {
            mousecursor();
        });



        /*-----------------------------------
            Progress Bar   
        -----------------------------------*/
        $('.progress-bar').each(function () {
            var $this = $(this);
            var progressWidth = $this.attr('style').match(/width:\s*(\d+)%/)[1] + '%';

            $this.waypoint(function () {
                $this.css({
                    '--progress-width': progressWidth,
                    'animation': 'animate-positive 1.8s forwards',
                    'opacity': '1'
                });
            }, { offset: '75%' });
        });



        /*--------------------------------------------------
          Search Popup
      ---------------------------------------------------*/
        const $searchWrap = $(".search-wrap");
        const $navSearch = $(".nav-search");
        const $searchClose = $("#search-close");

        $(document).on("click", ".search-trigger", function (e) {
            e.preventDefault();
            $searchWrap.animate({ opacity: "toggle" }, 500);
            $navSearch.add($searchClose).addClass("open");
        });

        $(document).on("click", ".search-close", function (e) {
            e.preventDefault();
            $searchWrap.animate({ opacity: "toggle" }, 500);
            $navSearch.add($searchClose).removeClass("open");
        });

        function closeSearch() {
            $searchWrap.fadeOut(200);
            $navSearch.add($searchClose).removeClass("open");
        }
        $(document.body).on("click", function (e) {
            closeSearch();
        });

        $(document).on("click", ".search-trigger, .main-search-input", function (e) {
            e.stopPropagation();
        });





        // run check periodically
        /*-----------------------------------
           Counter Up Animation
       -----------------------------------*/
        const counterup = () => {
            const counters = document.querySelectorAll('.counter-number');
            const speed = 200;

            const animate = (counter) => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(() => animate(counter), 1);
                } else {
                    counter.innerText = target;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 1 });

            counters.forEach(counter => observer.observe(counter));
        };

        if ($('.counter-number').length) {
            counterup();
        }

        // Initialize WOW.js
        new WOW().init();

        /*-----------------------------------
           GSAP Animations
        -----------------------------------*/
        gsap.registerPlugin(ScrollTrigger);



        // Staggered Reveal for Cards & Items
        const cardGroups = [
            ".service-card",
            ".fancy-box-wrapper",
            ".team-card",
            ".blog-card",
            ".project-card",
            ".pricing-card",
            ".counter-item"
        ];

        cardGroups.forEach(selector => {
            if ($(selector).length) {
                gsap.from(selector, {
                    scrollTrigger: {
                        trigger: selector,
                        start: "top 88%",
                    },
                    opacity: 0,
                    y: 50,
                    stagger: 0.15,
                    duration: 1,
                    ease: "power2.out",
                    clearProps: "all"
                });
            }
        });

        // Subtle Parallax for Background Shapes
        $(".shape img, .hero-shape-star img, .about-shape-1 img, .vector-shape img").each(function () {
            let target = $(this);
            gsap.to(target, {
                scrollTrigger: {
                    trigger: target,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                },
                y: 80,
                ease: "none",
            });
        });

        // Reveal-Left Image Animation
        // Auto-apply to key image containers
        var revealLeftSelectors = [
            ".hero-img-wrapper",
            ".about-img-group",
            ".about-thumb",
            ".chooseUs-thumb",
            ".wp-thumb-wrap",
            ".service-details-thumb",
            ".browser-content"
        ];

        document.querySelectorAll(revealLeftSelectors.join(", ")).forEach(function (el) {
            if (!el.classList.contains("reveal-left")) {
                el.classList.add("reveal-left");
            }
        });

        // Animate all .reveal-left elements
        document.querySelectorAll(".reveal-left").forEach(function (container) {
            // Style the container
            container.style.position = "relative";
            container.style.overflow = "hidden";

            // Create the overlay
            var overlay = document.createElement("div");
            overlay.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#EEFB13;z-index:5;transform-origin:left center;";
            container.appendChild(overlay);

            // Find the image inside
            var img = container.querySelector("img");

            // Timeline
            var tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 100%",
                    toggleActions: "play none none none",
                }
            });

            // Overlay slides in from left, then slides out to the right
            tl.fromTo(overlay,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.6, ease: "power2.inOut" }
            );

            if (img) {
                tl.from(img,
                    { scale: 1.3, duration: 0 },
                    0.6
                );
            }

            tl.to(overlay,
                { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "power2.inOut" },
                0.6
            );

            if (img) {
                tl.to(img,
                    { scale: 1, duration: 1.4, ease: "power2.out" },
                    0.6
                );
            }
        });

        // Image reveal effect for main thumbs
        $(".hero-img-wrapper img, .about-thumb img, .chooseUs-thumb img, .service-details-thumb img").each(function () {
            let target = $(this);
            gsap.from(target, {
                scrollTrigger: {
                    trigger: target,
                    start: "top 95%",
                },
                scale: 1.1,
                opacity: 0.9,
                duration: 1.8,
                ease: "expo.out",
                clearProps: "all"
            });
        });

        // Scrub Parallax for Large Section Images
        // Targets: project thumbs, browser-content, blog thumbs, team thumbs,
        //          about images, service images, hero images, gallery images
        const scrubImageSelectors = [
            ".about-img img",
            ".about-thumb-wrap img",
            ".service-thumb img",
            ".hero-thumb img",
            ".project-gallery img",
            ".projectGallery img",
            ".gallery-thumb img",
            ".wp-thumb-wrap img",
            "[data-speed] img"
        ];

        const scrubSelector = scrubImageSelectors.join(", ");

        document.querySelectorAll(scrubSelector).forEach(function (img) {
            // Ensure parent has overflow hidden for clean crop during scale
            var parent = img.parentElement;
            if (parent) {
                parent.style.overflow = "hidden";
            }

            // Get custom speed from data-speed attribute or use default
            var speed = parent && parent.getAttribute("data-speed")
                ? parseFloat(parent.getAttribute("data-speed"))
                : img.getAttribute("data-speed")
                    ? parseFloat(img.getAttribute("data-speed"))
                    : 0.15;

            gsap.fromTo(img,
                {
                    scale: 1.15,
                    yPercent: -8
                },
                {
                    scale: 1,
                    yPercent: 8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: parent || img,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2,
                    }
                }
            );
        });

        // Also support elements with explicit data-speed attribute
        document.querySelectorAll("[data-speed]").forEach(function (el) {
            var speed = parseFloat(el.getAttribute("data-speed")) || 0.15;

            // Skip if already handled above
            if (el.querySelector("img") && el.matches(scrubSelector.replace(/ img/g, ""))) return;

            el.style.overflow = "hidden";

            gsap.to(el, {
                yPercent: speed * 100,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.2,
                }
            });
        });

    });
    /*-----------------------------------
    Contact Form PHP Mail Handler
-----------------------------------*/
document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && (form.id === 'contactForm' || form.classList.contains('app-form'))) {
        e.preventDefault();
        
        var submitBtn = form.querySelector('button[type="submit"]');
        var responseDiv = form.querySelector('#formResponse');
        
        if (!responseDiv) {
            responseDiv = document.createElement('div');
            responseDiv.id = 'formResponse';
            responseDiv.className = 'mt-3';
            form.appendChild(responseDiv);
        }
        
        var originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin ms-2"></i>';
        }
        responseDiv.innerHTML = '';

        var formData = new FormData(form);
        var formAction = form.getAttribute('action') || 'send_email.php';

        fetch(formAction, {
            method: 'POST',
            body: formData
        })
        .then(function (res) {
            if (!res.ok) {
                throw new Error('Server returned status ' + res.status);
            }
            return res.json();
        })
        .then(function (data) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
            if (data.success) {
                responseDiv.innerHTML = '<div class="alert alert-success text-white bg-success border-0 mt-3 p-3 rounded-3">' + (data.message || 'Thank you! Your message has been sent successfully.') + '</div>';
                form.reset();
            } else {
                responseDiv.innerHTML = '<div class="alert alert-danger text-white bg-danger border-0 mt-3 p-3 rounded-3">' + (data.message || 'Something went wrong. Please try again.') + '</div>';
            }
        })
        .catch(function (err) {
            console.error('Contact Form Error:', err);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
            var errMessage = 'An error occurred while sending your message. Please try again.';
            if (window.location.protocol === 'file:') {
                errMessage = 'PHP scripts cannot execute directly from local file (file://) protocol. Please upload files to your web hosting server or run via a local PHP server (e.g., http://localhost:8000).';
            }
            responseDiv.innerHTML = '<div class="alert alert-danger text-white bg-danger border-0 mt-3 p-3 rounded-3">' + errMessage + '</div>';
        });
    }
});
    // End Document Ready Function   

})(jQuery); // End jQuery




