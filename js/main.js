document.addEventListener('DOMContentLoaded', () => {
    // 새로고침 시 브라우저의 스크롤 복원 기능 비활성화 (풀페이지 스크롤 정합성 확보)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const wrapper = document.getElementById('scroll-wrapper');
    const sections = wrapper ? wrapper.querySelectorAll('section') : [];
    let currentSectionIndex = 0;
    let isScrolling = false;
    let lastScrollTime = 0;

    const navbar = document.querySelector('.navbar');
    let isTechSliderInitialized = false;

    // --- CASES - Immersive Scroll Video Animation ---
    let casesInternalProgress = 0;

    function updateCasesAnimation(progress) {
        const wrapper = document.querySelector('.cases-scroll-wrapper');
        const videoBox = wrapper?.querySelector('.cases-video-box');

        if (!wrapper || !videoBox) return;

        const viewHeight = window.innerHeight;
        const viewWidth = window.innerWidth;

        let currentWidth, currentHeight, currentRadius, currentTop;

        if (progress < 0.6) {
            let p1 = progress / 0.6;
            currentWidth = 800 + (viewWidth - 800) * p1;
            currentHeight = 450 + (viewHeight * 0.5 - 450) * p1;
            currentRadius = 8 * (1 - p1);
            currentTop = 52 - (52 * (progress / 1.0));
        } else {
            let p2 = (progress - 0.6) / 0.4;
            currentWidth = viewWidth;
            currentHeight = (viewHeight * 0.5) + (viewHeight * 0.5) * p2;
            currentRadius = 0;
            currentTop = 52 - (52 * (progress / 1.0));
        }

        videoBox.style.width = `${currentWidth}px`;
        videoBox.style.height = `${currentHeight}px`;
        videoBox.style.top = `${currentTop}%`;
        videoBox.style.borderRadius = `${currentRadius}px`;

        const links = wrapper.querySelector('.cases-links');
        if (progress > 0.85) {
            wrapper.classList.add('full-bg');
            if (links) links.classList.add('show-links');
            if (navbar) navbar.classList.remove('dark');
        } else {
            wrapper.classList.remove('full-bg');
            if (links) links.classList.remove('show-links');
            if (navbar) navbar.classList.add('dark');
        }
    }

    // ❌ Mobile Menu Toggle → common.js 로 이동 (제거)
    // ❌ Mega Menu Hover   → common.js 로 이동 (제거)

    // Handle Wheel Events
    window.addEventListener('wheel', (e) => {
        if (!wrapper || window.innerWidth <= 1024) return;

        e.preventDefault();

        const now = Date.now();

        if (now - lastScrollTime < 1000 || isScrolling) return;

        if (sections[currentSectionIndex].id === 'vision') {
            const visionSection = sections[currentSectionIndex];
            if (e.deltaY > 0 && !visionSection.classList.contains('is-expanded')) {
                visionSection.classList.add('is-expanded');
                updateUIColors(currentSectionIndex);
                lastScrollTime = now - 500;
                return;
            } else if (e.deltaY < 0 && visionSection.classList.contains('is-expanded')) {
                visionSection.classList.remove('is-expanded');
                updateUIColors(currentSectionIndex);
                lastScrollTime = now - 500;
                return;
            }
        }

        if (sections[currentSectionIndex].id === 'cases') {
            if (e.deltaY > 0 && casesInternalProgress < 1) {
                casesInternalProgress = Math.min(casesInternalProgress + 0.34, 1);
                updateCasesAnimation(casesInternalProgress);
                lastScrollTime = now;
                return;
            } else if (e.deltaY < 0 && casesInternalProgress > 0) {
                casesInternalProgress = Math.max(casesInternalProgress - 0.34, 0);
                updateCasesAnimation(casesInternalProgress);
                lastScrollTime = now;
                return;
            }
        }

        if (e.deltaY > 0) {
            if (currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                if (sections[currentSectionIndex].id === 'cases') {
                    casesInternalProgress = 0;
                    updateCasesAnimation(0);
                }
                moveToSection(currentSectionIndex);
            }
        } else {
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                moveToSection(currentSectionIndex);
            }
        }

        lastScrollTime = now;
    }, { passive: false });

    // Handle Logo Click
    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            if (wrapper) {
                e.preventDefault();
                navbar.classList.remove('hidden');
                currentSectionIndex = 0;
                moveToSection(0);
            }
        });
    }

    // Handle Nav Clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetIndex = Array.from(sections).findIndex(s => s.id === targetId);

                if (targetIndex !== -1) {
                    navbar.classList.remove('hidden');
                    if (sections[targetIndex].id === 'cases') {
                        casesInternalProgress = 0;
                        updateCasesAnimation(0);
                    }
                    currentSectionIndex = targetIndex;
                    moveToSection(currentSectionIndex);

                    const navLinks = document.querySelector('.nav-links');
                    const mobileToggle = document.querySelector('.mobile-toggle');
                    if (navLinks && navLinks.classList.contains('mobile-active')) {
                        mobileToggle.click();
                    }
                }
            }
        });
    });

    function moveToSection(index) {
        if (!wrapper) return;

        if (window.innerWidth <= 1024) {
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
                sections.forEach(s => s.classList.remove('active'));
                sections[index].classList.add('active');
                updateCounters(index);
                updateUIColors(index);
            }
            return;
        }

        isScrolling = true;

        const prevSection = wrapper.querySelector('section.active');
        const offset = index * 100;
        wrapper.style.transform = `translateY(-${offset}vh)`;

        if (prevSection && prevSection !== sections[index]) {
            setTimeout(() => {
                prevSection.classList.remove('active');
                prevSection.classList.remove('is-expanded');
            }, 1000);
        }

        const delay = (!prevSection) ? 0 : 300;

        setTimeout(() => {
            if (sections[index]) {
                const target = sections[index];
                target.classList.add('active');
                if (target.id === 'tech') {
                    if (!isTechSliderInitialized) initTechSlider();
                }
                else if (target.id === 'roadmap') triggerRoadmapAnimation();
            }
        }, delay);

        updateCounters(index);
        updateUIColors(index);

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    function updateCounters(index) {
        const sectionCounter = document.querySelector('.section-counter');
        const counterCurrent = sectionCounter ? sectionCounter.querySelector('.current') : null;
        const counterTotal = sectionCounter ? sectionCounter.querySelector('.total') : null;
        if (counterCurrent) counterCurrent.innerText = (index + 1).toString().padStart(2, '0');
        if (counterTotal && sections.length > 0) counterTotal.innerText = sections.length.toString().padStart(2, '0');
    }

    function updateUIColors(index) {
        if (!sections[index]) return;

        const currentId = sections[index].id;
        const sectionCounter = document.querySelector('.section-counter');
        const floatingContact = document.querySelector('.floating-contact');

        let isWhiteBG = ['tech', 'cases'].includes(currentId) ||
            (currentId === 'vision' && !sections[index].classList.contains('is-expanded'));

        if (currentId === 'cases' && casesInternalProgress > 0.8) isWhiteBG = false;

        if (isWhiteBG) {
            navbar.classList.add('dark');
            if (sectionCounter) sectionCounter.classList.add('dark');
            if (floatingContact) floatingContact.classList.add('dark');
        } else {
            navbar.classList.remove('dark');
            if (sectionCounter) sectionCounter.classList.remove('dark');
            if (floatingContact) floatingContact.classList.remove('dark');
        }
    }

    function initTechSlider() {
        const slider = document.querySelector('.tech-new-slider');
        const cards = document.querySelectorAll('.tech-new-card');
        const listItems = document.querySelectorAll('.tech-new-list li');
        const activeName = document.querySelector('.active-name');
        const cardCounter = document.querySelector('.tech-card-counter');
        const lineFill = document.querySelector('.line-fill');
        const prevBtn = document.querySelector('.t-nav-btn.prev');
        const nextBtn = document.querySelector('.t-nav-btn.next');

        if (!slider || cards.length === 0 || isTechSliderInitialized) return;
        isTechSliderInitialized = true;

        const originalCardsCount = cards.length;
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.remove('active');
            slider.appendChild(clone);
        });

        const allCards = document.querySelectorAll('.tech-new-card');
        let currentIndex = 0;
        let isTransitioning = false;
        let autoplayTimer = null;

        function updateSlider(index, useTransition = true) {
            if (isTransitioning && useTransition) return;

            if (useTransition) {
                isTransitioning = true;
                slider.classList.remove('no-transition');
            } else {
                slider.classList.add('no-transition');
            }

            currentIndex = index;
            const activeIndex = currentIndex % originalCardsCount;
            allCards.forEach((card, i) => card.classList.toggle('active', i === currentIndex));
            listItems.forEach((item, i) => item.classList.toggle('active', i === activeIndex));

            if (activeName && listItems[activeIndex]) activeName.innerText = listItems[activeIndex].innerText;
            if (cardCounter) cardCounter.innerText = `${(activeIndex + 1).toString().padStart(2, '0')} / ${originalCardsCount.toString().padStart(2, '0')}`;
            if (lineFill) {
                const segmentWidth = 320 / originalCardsCount;
                lineFill.style.width = `${segmentWidth}px`;
                lineFill.style.left = `${activeIndex * segmentWidth}px`;
            }

            slider.style.transform = `translateX(${-currentIndex * 490}px)`;
            requestAnimationFrame(() => slider.classList.remove('no-transition'));
        }

        updateSlider(0, false);
        requestAnimationFrame(() => slider.classList.remove('no-transition'));

        slider.addEventListener('transitionend', (e) => {
            if (e.target !== slider) return;
            isTransitioning = false;
            if (currentIndex >= originalCardsCount) {
                requestAnimationFrame(() => {
                    slider.classList.add('no-transition');
                    requestAnimationFrame(() => {
                        updateSlider(0, false);
                        requestAnimationFrame(() => slider.classList.remove('no-transition'));
                    });
                });
            }
            if (currentIndex < 0) {
                requestAnimationFrame(() => {
                    slider.classList.add('no-transition');
                    requestAnimationFrame(() => {
                        updateSlider(originalCardsCount - 1, false);
                        requestAnimationFrame(() => slider.classList.remove('no-transition'));
                    });
                });
            }
        });

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                if (!isTransitioning) updateSlider(currentIndex + 1);
            }, 3000);
        }

        function stopAutoplay() {
            if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); updateSlider(currentIndex - 1); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); updateSlider(currentIndex + 1); startAutoplay(); });
        listItems.forEach((item, i) => item.addEventListener('click', () => { stopAutoplay(); updateSlider(i); startAutoplay(); }));
        allCards.forEach((card, i) => card.addEventListener('click', () => { stopAutoplay(); updateSlider(i); startAutoplay(); }));

        updateSlider(0, false);
        startAutoplay();
    }

    let activeAnimations = [];

    function triggerRoadmapAnimation() {
        const mainCounter = document.querySelector('.stats-main .num');
        const grid = document.querySelector('.stats-grid');
        const itemCounters = document.querySelectorAll('.stat-item .value');

        if (window.innerWidth <= 1024) {
            if (mainCounter) mainCounter.innerText = mainCounter.getAttribute('data-target');
            if (itemCounters) itemCounters.forEach(c => c.innerText = c.getAttribute('data-target'));
            if (grid) grid.classList.add('active');
            return;
        }

        activeAnimations.forEach(id => cancelAnimationFrame(id));
        activeAnimations = [];
        if (mainCounter) mainCounter.innerText = '0';
        if (itemCounters) itemCounters.forEach(c => c.innerText = '0');

        setTimeout(() => {
            if (grid) grid.classList.add('active');
            countUp(mainCounter, 1000);
            setTimeout(() => {
                itemCounters.forEach((counter, idx) => {
                    setTimeout(() => countUp(counter, 800), idx * 100);
                });
            }, 500);
        }, 100);
    }

    function countUp(el, duration, callback) {
        if (!el) return;
        const target = parseInt(el.getAttribute('data-target'));
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            el.innerText = Math.floor(progress * target);
            if (progress < 1) {
                activeAnimations.push(requestAnimationFrame(update));
            } else {
                el.innerText = target;
                if (callback) callback();
            }
        }
        activeAnimations.push(requestAnimationFrame(update));
    }

    // --- Hero Slogan Cycle ---
    function initHeroSloganCycle() {
        const titleContainer = document.querySelector('.slogan-container');
        const descContainer = document.querySelector('.desc-container');
        if (!titleContainer || !descContainer || !heroVideo) return;

        const titles = titleContainer.querySelectorAll('.slogan-title');
        const descs = descContainer.querySelectorAll('.slogan-desc');
        if (titles.length === 0 || descs.length === 0) return;

        const transitionTime = 11.0;
        const exitDuration = 0.5;
        const videoDuration = 20.03;
        let lastState = -1;

        function updateSloganByTime() {
            const currentTime = heroVideo.currentTime;
            let currentState;
            if (currentTime < transitionTime - exitDuration) currentState = 0;
            else if (currentTime < transitionTime) currentState = 1;
            else if (currentTime < videoDuration - exitDuration) currentState = 2;
            else currentState = 3;

            if (currentState === lastState) return;
            titles.forEach(t => t.classList.remove('active', 'exit'));
            descs.forEach(d => d.classList.remove('active', 'exit'));

            if (currentState === 0) { titles[0]?.classList.add('active'); descs[0]?.classList.add('active'); }
            else if (currentState === 1) { titles[0]?.classList.add('exit'); descs[0]?.classList.add('exit'); }
            else if (currentState === 2) { titles[1]?.classList.add('active'); descs[1]?.classList.add('active'); }
            else if (currentState === 3) { titles[1]?.classList.add('exit'); descs[1]?.classList.add('exit'); }

            lastState = currentState;
        }

        heroVideo.addEventListener('timeupdate', updateSloganByTime);
        updateSloganByTime();
    }

    // --- Hero Video Controls ---
    const heroVideo = document.getElementById('hero-video');
    const videoToggle = document.getElementById('video-toggle');
    const videoProgressFill = document.getElementById('video-progress-fill');

    if (heroVideo && videoToggle && videoProgressFill) {
        initHeroSloganCycle();
        videoToggle.addEventListener('click', () => {
            const icon = videoToggle.querySelector('i');
            if (heroVideo.paused) {
                heroVideo.play();
                if (icon) icon.className = 'ri-pause-line';
            } else {
                heroVideo.pause();
                if (icon) icon.className = 'ri-play-line';
            }
        });
        heroVideo.addEventListener('timeupdate', () => {
            if (heroVideo.duration) {
                videoProgressFill.style.width = `${(heroVideo.currentTime / heroVideo.duration) * 100}%`;
            }
        });
    }

    // 초기 섹션 동기화
    if (sections.length > 0) {
        if (window.innerWidth > 1024) {
            moveToSection(0);
        } else {
            if (wrapper) {
                wrapper.style.transform = 'none';
                wrapper.style.height = 'auto';
                wrapper.style.display = 'block';
            }
            sections.forEach(s => s.classList.add('active'));
            setTimeout(triggerRoadmapAnimation, 800);
        }
        setTimeout(() => { isScrolling = false; }, 100);
    }
});