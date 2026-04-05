/**
 * include.js
 * header.html / footer.html 컴포넌트를 fetch()로 로드
 * common.js 보다 먼저 실행되어야 함 (defer 순서 주의)
 */

async function loadComponent(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} 로드 실패: ${res.status}`);
        el.innerHTML = await res.text();
    } catch (err) {
        console.error('[include.js]', err);
    }
}

// 루트 기준 절대경로 사용 (어느 depth 페이지에서도 동일하게 동작)
(async () => {
    await loadComponent('#header-wrap', '/components/header.html');
    await loadComponent('#footer-wrap', '/components/footer.html');

    // 컴포넌트 로드 완료 후 common.js 의존 이벤트 재발동
    document.dispatchEvent(new Event('componentsLoaded'));
})();