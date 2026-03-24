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

    const footer = document.querySelector('.main-footer');
    const navbar = document.querySelector('.navbar');
    let isFooterVisible = false;

    // --- CASES - Immersive Scroll Video Animation 관리를 위한 전역 변수 및 함수 (상단 배치) ---
    let casesInternalProgress = 0; // 0 (Small) ~ 1 (Full)

    function updateCasesAnimation(progress) {
        const wrapper = document.querySelector('.cases-scroll-wrapper');
        const videoBox = wrapper?.querySelector('.cases-video-box');
        
        if (!wrapper || !videoBox) return;

        const viewHeight = window.innerHeight;
        const viewWidth = window.innerWidth;
        
        // 1. Video Box Size & Position (Apple Style Zoom)
        let currentWidth, currentHeight, currentRadius, currentTop;

        if (progress < 0.6) {
            // Small -> Wide (가로 확장 단계)
            let p1 = progress / 0.6;
            currentWidth = 800 + (viewWidth - 800) * p1;
            currentHeight = 450 + (viewHeight * 0.5 - 450) * p1; 
            currentRadius = 8 * (1 - p1);
            // 초기 위치 52%에서 점진적으로 0%로 이동
            currentTop = 52 - (52 * (progress / 1.0)); 
        } else {
            // Wide -> Full (세로 전체 확장 단계)
            let p2 = (progress - 0.6) / 0.4;
            currentWidth = viewWidth;
            currentHeight = (viewHeight * 0.5) + (viewHeight * 0.5) * p2;
            currentRadius = 0;
            currentTop = 52 - (52 * (progress / 1.0));
        }

        // 스타일 적용
        videoBox.style.width = `${currentWidth}px`;
        videoBox.style.height = `${currentHeight}px`;
        videoBox.style.top = `${currentTop}%`;
        videoBox.style.borderRadius = `${currentRadius}px`;

        // 2. Text Inversion State (비디오가 배경을 다 덮은 단계)
        const links = wrapper.querySelector('.cases-links');
        if (progress > 0.85) {
            wrapper.classList.add('full-bg');
            if (links) links.classList.add('show-links');
            if (navbar) navbar.classList.remove('dark'); // 비디오가 꽉 차면 GNB를 다시 흰색으로
        } else {
            wrapper.classList.remove('full-bg');
            if (links) links.classList.remove('show-links');
            if (navbar) navbar.classList.add('dark'); // 비디오가 작으면 GNB를 검은색(dark)으로
        }
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            
            // Prevent body scroll when mobile menu is open
            if (navLinks.classList.contains('mobile-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Mega Menu Hover Logic
    navbar.addEventListener('mouseenter', () => {
        navbar.classList.add('is-open');
    });

    navbar.addEventListener('mouseleave', () => {
        navbar.classList.remove('is-open');
    });

    // Handle Wheel Events
    window.addEventListener('wheel', (e) => {
        if (!wrapper || window.innerWidth <= 1024) return;
        
        e.preventDefault();
        
        const now = Date.now();
        
        // Cases 섹션 내부 애니메이션 (일방향 단계별 확장)
        if (sections[currentSectionIndex].id === 'cases' && !isFooterVisible) {
            if (e.deltaY > 0 && casesInternalProgress < 1) {
                // DOWN (Expand - 점진적으로 확장)
                casesInternalProgress = Math.min(casesInternalProgress + 0.34, 1);
                updateCasesAnimation(casesInternalProgress);
                lastScrollTime = now;
                return;
            } else if (e.deltaY < 0) {
                // UP (이전 섹션으로 즉시 이동, 축소 생략)
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                    moveToSection(currentSectionIndex);
                    lastScrollTime = now;
                    return;
                }
            }
        }

        // 일반 섹션 이동 시에는 기존의 1초 지연 로직 유지
        if (now - lastScrollTime < 1000 || isScrolling) return;

        if (e.deltaY > 0) {
            // DOWN

            if (currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                // Roadmap -> Cases 진입 시에는 0으로 초기화
                if (sections[currentSectionIndex].id === 'cases') {
                    casesInternalProgress = 0;
                    updateCasesAnimation(0);
                }
                moveToSection(currentSectionIndex);
            } else if (currentSectionIndex === sections.length - 1 && !isFooterVisible) {
                // Show footer
                isFooterVisible = true;
                navbar.classList.add('hidden'); // Hide navbar
                moveToFooter(); // 푸터 이동 함수 호출 (복구)
            }
        } else {
            // UP
            if (isFooterVisible) {
                // Hide footer, back to cases section
                isFooterVisible = false;
                navbar.classList.remove('hidden'); // Show navbar
                
                // 푸터에서 올라올 때는 비디오가 100% 확장된 상태를 유지해야 함 (사용자 요청)
                casesInternalProgress = 1;
                updateCasesAnimation(1);
                
                moveToSection(currentSectionIndex);
            } else if (currentSectionIndex > 0) {
                currentSectionIndex--;
                // Cases 섹션으로 역진입(Roadmap 쪽으로 올라감) 시에도 사용자 요청에 따라 축소 로직 생략 가능
                // 단, Roadmap -> Cases로 다시 내려올 때 0으로 리셋되므로 여기서는 상태를 유지하거나 무시
                moveToSection(currentSectionIndex);
            }
        }
        
        lastScrollTime = now;
    }, { passive: false });

    // Handle Logo Click (Back to Top if on main page, else follow link)
    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            if (wrapper) { // Only do scroll logic if on the full-page scroll main page
                e.preventDefault();
                isFooterVisible = false;
                navbar.classList.remove('hidden'); // Show navbar
                currentSectionIndex = 0;
                moveToSection(0);
            }
        });
    }

    // Handle Nav Clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only prevent default if it's an anchor link for the current page
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetIndex = Array.from(sections).findIndex(s => s.id === targetId);
                
                if (targetIndex !== -1) {
                    isFooterVisible = false; // Reset footer state
                    navbar.classList.remove('hidden'); // Show navbar
                    
                    // 네비게이션 클릭으로 Cases 진입 시에는 항상 0부터 시작
                    if (sections[targetIndex].id === 'cases') {
                        casesInternalProgress = 0;
                        updateCasesAnimation(0);
                    }
                    
                    currentSectionIndex = targetIndex;
                    moveToSection(currentSectionIndex);

                    // Close mobile menu on link click
                    if (navLinks.classList.contains('mobile-active')) {
                        mobileToggle.click();
                    }
                }
            }
            // External links (like about/ceo.html) will naturally proceed
        });
    });

    // Handle Back to Top (Subpages)
    const backToTopSub = document.querySelector('.back-to-top-sub');
    if (backToTopSub) {
        backToTopSub.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function moveToSection(index) {
        if (!wrapper) return;

        // 모바일(1024px 이하) 환경에서는 트랜스폼 기반 이동 대신 네이티브 스크롤 사용
        if (window.innerWidth <= 1024) {
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
                
                // 모바일에서도 GNB나 카운터 상태는 동기화
                sections.forEach(s => s.classList.remove('active'));
                sections[index].classList.add('active');
                
                updateCounters(index);
                updateUIColors(index);
            }
            return;
        }

        isScrolling = true;
        
        // 이전 섹션 찾기 (active 클래스가 있는 섹션)
        const prevSection = wrapper.querySelector('section.active');
        
        const offset = index * 100;
        wrapper.style.transform = `translateY(-${offset}vh)`;

        // 이전 섹션은 이동이 끝날 때까지(1s) active를 유지하여 콘텐츠가 급격히 사라지지 않게 함
        if (prevSection && prevSection !== sections[index]) {
            setTimeout(() => {
                prevSection.classList.remove('active');
            }, 1000);
        }

        // 새 섹션은 시야에 들어올 즈음(300ms) active 부여하여 애니메이션 트리거
        // 전환 중(1s)에 미리 애니메이션을 시작시켜 매우 역동적인 느낌을 줌
        const delay = (!prevSection) ? 0 : 300;
        
        setTimeout(() => {
            if (sections[index]) {
                const target = sections[index];
                target.classList.add('active');
                
                // 섹션별 고유 애니메이션 한 번만 실행
                if (target.id === 'tech') triggerTechAnimation();
                else if (target.id === 'roadmap') triggerRoadmapAnimation();
            }
        }, delay);

        updateCounters(index);
        updateUIColors(index);

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // UI 상태 업데이트 함수들 (Refactored)
    function updateCounters(index) {
        const sectionCounter = document.querySelector('.section-counter');
        const counterCurrent = sectionCounter ? sectionCounter.querySelector('.current') : null;
        const counterTotal = sectionCounter ? sectionCounter.querySelector('.total') : null;

        if (counterCurrent) {
            counterCurrent.innerText = (index + 1).toString().padStart(2, '0');
        }
        if (counterTotal && sections.length > 0) {
            counterTotal.innerText = sections.length.toString().padStart(2, '0');
        }
    }

    function updateUIColors(index) {
        if (!sections[index]) return;
        
        const darkSections = ['tech', 'cases'];
        const sectionCounter = document.querySelector('.section-counter');
        const floatingContact = document.querySelector('.floating-contact');

        if (darkSections.includes(sections[index].id)) {
            // Cases 섹션의 경우 비디오 확장도에 따라 GNB 컬러 결정 (0.8 초과 시 흰색)
            // 모바일에서는 확장 로직이 없으므로 항상 어두운 배경(GNB는 흰색)으로 간주될 수 있으나, 
            // 현재 모바일 CSS에서 텍스트를 검정으로 바꿨으므로 GNB도 다크 모드(글자 검정)로 유지
            if (window.innerWidth > 1024 && sections[index].id === 'cases' && casesInternalProgress > 0.8) {
                navbar.classList.remove('dark');
            } else {
                navbar.classList.add('dark');
            }
            
            if (sectionCounter) sectionCounter.classList.add('dark');
            if (floatingContact) floatingContact.classList.add('dark');
        } else {
            navbar.classList.remove('dark');
            if (sectionCounter) sectionCounter.classList.remove('dark');
            if (floatingContact) floatingContact.classList.remove('dark');
        }
    }

    function triggerTechAnimation() {
        // 모바일(1024px 이하)에서는 정적 수직 레이아웃을 사용하므로 JS 애니메이션 비활성화
        if (window.innerWidth <= 1024) return;

        // Tech 섹션은 CSS 애니메이션이 주가 되므로, 탭 클릭 핸들러만 한 번 등록 (중복 방지)
        const techSection = document.querySelector('.tech-section');
        if (!techSection || techSection.dataset.initialized) return;

        const cards = techSection.querySelectorAll('.product-card');
        const menuItems = techSection.querySelectorAll('.side-menu li');
        const paginationNums = techSection.querySelectorAll('.pagination .num');
        const autoplayBtn = techSection.querySelector('.tech-autoplay-btn');
        const autoplayIcon = autoplayBtn.querySelector('i');
        
        // 초기 상태: 아무것도 확장되지 않은 50/50 상태 유지 (currentIndex = -1)
        let currentIndex = -1; 
        let autoSlideInterval;
        let isPaused = false;

        techSection.dataset.initialized = "true";

        function activateTab(index) {
            currentIndex = index;
            // 최초 활성화 시 클래스 추가 (축소용)
            techSection.classList.add('animation-started');
            
            // 1. Update Cards
            cards.forEach((card, i) => {
                if (i === index) card.classList.add('active');
                else card.classList.remove('active');
            });

            // 2. Update Side Menu
            menuItems.forEach((item, i) => {
                if (i === index) item.classList.add('active');
                else item.classList.remove('active');
            });

            // 3. Update Pagination
            paginationNums.forEach((num, i) => {
                if (i === index) num.classList.add('active');
                else num.classList.remove('active');
            });
        }

        function startAutoSlide() {
            if (isPaused) return; // 일시정지 상태면 시작 안 함
            
            // 첫 시동 대기 (currentIndex가 -1일 때만)
            if (currentIndex === -1) {
                setTimeout(() => {
                    if (currentIndex === -1 && !isPaused) {
                        activateTab(0);
                        runInterval();
                    }
                }, 2500);
            } else {
                runInterval();
            }
        }

        function runInterval() {
            stopAutoSlide(); // 기존 인터벌 제거
            autoSlideInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % cards.length;
                activateTab(nextIndex);
            }, 5000);
            // 아이콘을 정지(Stop) 모양으로 보장
            autoplayIcon.className = 'ri-stop-mini-fill';
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        // 재생/일시정지 버튼 클릭 이벤트
        autoplayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (autoSlideInterval) {
                stopAutoSlide();
                isPaused = true;
                autoplayIcon.className = 'ri-play-mini-fill';
            } else {
                isPaused = false;
                // 현재 -1 상태면 즉시 0번 활성화 후 순환 시작
                if (currentIndex === -1) activateTab(0);
                runInterval();
                autoplayIcon.className = 'ri-stop-mini-fill';
            }
        });

        // Add Click Handlers for Product Cards
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                stopAutoSlide(); // 사용자 조작 시 자동 순환 중단
                isPaused = true; // 사용자 직접 조작 시 일시정지 상태로 간주
                autoplayIcon.className = 'ri-play-mini-fill';
                activateTab(index);
            });
        });

        // Add Click Handlers for Side Menu Items
        menuItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                stopAutoSlide(); // 사용자 조작 시 자동 순환 중단
                isPaused = true; // 사용자 직접 조작 시 일시정지 상태로 간주
                autoplayIcon.className = 'ri-play-mini-fill';
                activateTab(index);
            });
        });

        // 초기 자동 순환 시작
        startAutoSlide();
    }

    let activeAnimations = []; // Track active countUp animations to cancel them if needed

    function triggerRoadmapAnimation() {
        // Cancel any ongoing animations to prevent overlapping
        activeAnimations.forEach(id => cancelAnimationFrame(id));
        activeAnimations = [];

        const mainCounter = document.querySelector('.stats-main .num');
        const grid = document.querySelector('.stats-grid');
        const itemCounters = document.querySelectorAll('.stat-item .value');

        // Reset text values immediately (CSS classes are handled by moveToSection)
        if (mainCounter) mainCounter.innerText = '0';
        if (itemCounters) itemCounters.forEach(c => c.innerText = '0');

        // Give a small delay to start counting
        setTimeout(() => {
            // 1. Grid Active (CSS Animations for lines/items)
            if (grid) grid.classList.add('active');

            // 2. Main Counter Starts
            countUp(mainCounter, 1000);

            // 3. Item Counters Start with slight delay
            setTimeout(() => {
                itemCounters.forEach((counter, idx) => {
                    setTimeout(() => {
                        countUp(counter, 800);
                    }, idx * 100);
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
            
            // Linear progress (No slow down at the end)
            const currentCount = Math.floor(progress * target);
            
            el.innerText = currentCount;

            if (progress < 1) {
                const animId = requestAnimationFrame(update);
                activeAnimations.push(animId);
            } else {
                el.innerText = target;
                if (callback) callback();
            }
        }
        const initialAnimId = requestAnimationFrame(update);
        activeAnimations.push(initialAnimId);
    }

    function moveToFooter() {
        if (!wrapper || !footer) return;
        isScrolling = true;
        const baseOffset = (sections.length - 1) * 100;
        const footerHeight = footer.offsetHeight;
        wrapper.style.transform = `translateY(calc(-${baseOffset}vh - ${footerHeight}px))`;

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // --- Hero Slogan Cycle ---
    function initHeroSloganCycle() {
        const titleContainer = document.querySelector('.slogan-container');
        const descContainer = document.querySelector('.desc-container');
        if (!titleContainer || !descContainer) return;

        const titles = titleContainer.querySelectorAll('.slogan-title');
        const descs = descContainer.querySelectorAll('.slogan-desc');
        if (titles.length <= 1 || descs.length <= 1) return;

        let currentIndex = 0;

        function rotateSlogan() {
            const currentTitle = titles[currentIndex];
            const currentDesc = descs[currentIndex];
            
            // 1. 퇴장 애니메이션 시작 (타이틀 & 설명글)
            currentTitle.classList.remove('active');
            currentTitle.classList.add('exit');
            currentDesc.classList.remove('active');
            currentDesc.classList.add('exit');

            // 2. 다음 인덱스 계산
            currentIndex = (currentIndex + 1) % titles.length;
            const nextTitle = titles[currentIndex];
            const nextDesc = descs[currentIndex];

            // 3. 퇴장 애니메이션(0.8s)이 끝난 후 상태 정리 및 다음 요소 등장
            setTimeout(() => {
                currentTitle.classList.remove('exit');
                currentDesc.classList.remove('exit');
                
                // 새로운 타이틀과 설명글 활성화 (CSS delay에 의해 1->2->3 순차 등장)
                nextTitle.classList.add('active');
                nextDesc.classList.add('active');
            }, 800);
        }

        // 7초마다 순환 (애니메이션 시간 포함 충분한 간격)
        setInterval(rotateSlogan, 7000);
    }

    // --- Hero Video Controls ---
    const heroVideo = document.getElementById('hero-video');
    const videoToggle = document.getElementById('video-toggle');
    const videoProgressFill = document.getElementById('video-progress-fill');

    if (heroVideo && videoToggle && videoProgressFill) {
        initHeroSloganCycle(); // 슬로건 순환 시작
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
                const progress = (heroVideo.currentTime / heroVideo.duration) * 100;
                videoProgressFill.style.width = `${progress}%`;
            }
        });
    }

    // 초기에 첫 번째 섹션 상태 동기화 및 애니메이션 트리거
    if (sections.length > 0) {
        moveToSection(0);
        // 초기 렌더링 시 isScrolling을 false로 유지하여 첫 터치를 바로 허용
        setTimeout(() => { isScrolling = false; }, 100);
    }

    // 섹션 진입 시 초기화 로직 (필요 시)
    function initCasesToggle() {
        const wrapper = document.querySelector('.cases-scroll-wrapper');
        if (wrapper && currentSectionIndex !== Array.from(sections).findIndex(s => s.id === 'cases')) {
            // 다른 섹션으로 이동할 때 진행도 리셋 (원할 경우)
            // casesInternalProgress = 0;
            // updateCasesAnimation(0);
        }
    }
});
