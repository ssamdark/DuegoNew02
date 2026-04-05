/**
 * common.js
 * 모든 페이지 공통 스크립트 (GNB, 모바일 메뉴)
 * - 메인: header 직접 포함 → DOMContentLoaded 에서 실행
 * - 서브: include.js 로 header 로드 → componentsLoaded 에서 실행
 */

function initCommon() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // -----------------------------------------------
    // 1. GNB Mega Menu (Hover)
    // -----------------------------------------------
    navbar.addEventListener('mouseenter', () => {
        navbar.classList.add('is-open');
    });

    navbar.addEventListener('mouseleave', () => {
        navbar.classList.remove('is-open');
    });

    // -----------------------------------------------
    // 2. 서브 페이지 GNB 고정 (is-open-sub 클래스)
    // -----------------------------------------------
    const isSubPage = document.body.classList.contains('is-sub-page');
    if (isSubPage) {
        navbar.classList.add('is-open-sub');
    }

    // -----------------------------------------------
    // 3. 모바일 메뉴 토글
    // -----------------------------------------------
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            document.body.style.overflow =
                navLinks.classList.contains('mobile-active') ? 'hidden' : '';
        });
    }

    // -----------------------------------------------
    // 4. 서브 페이지 Back to Top
    // -----------------------------------------------
    const backToTop = document.querySelector('.back-to-top-sub');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -----------------------------------------------
    // 5. 현재 페이지 GNB active 자동 감지
    // -----------------------------------------------
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
        const links = item.querySelectorAll('.sub-menu a');
        links.forEach(link => {
            if (link.getAttribute('href') && currentPath.endsWith(link.getAttribute('href').replace('../', '/'))) {
                item.classList.add('active');
            }
        });
    });
}

// 메인 페이지: header 직접 포함 → DOMContentLoaded
document.addEventListener('DOMContentLoaded', initCommon);

// 서브 페이지: include.js 로 header 로드 완료 후 실행
document.addEventListener('componentsLoaded', initCommon);