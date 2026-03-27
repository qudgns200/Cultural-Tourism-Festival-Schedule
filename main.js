/**
 * 공공데이터포털 API 설정
 */
const API_CONFIG = {
    // 직접 호출 대신 프록시 서버를 기본으로 사용하도록 구성
    endpoint: 'https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api',
    // 인코딩된 서비스키와 디코딩된 서비스키 모두 시도할 수 있도록 준비
    serviceKey: 'a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890',
    numOfRows: 200, // 데이터가 부족할 수 있으므로 더 많이 요청
    type: 'json'
};

/**
 * 페이지 로드 시 실행
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayFestivals();
});

/**
 * 메인 로직: 데이터 패치 -> 필터링 -> 렌더링
 */
async function fetchAndDisplayFestivals() {
    const grid = document.getElementById('festival-grid');

    // 여러 프록시 서버를 순차적으로 시도
    const proxies = [
        (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        (url) => `https://cors-anywhere.herokuapp.com/${url}`,
        (url) => `https://thingproxy.freeboard.io/fetch/${url}`
    ];

    const fetchWithRetries = async () => {
        let lastError;
        let baseUrl = `${API_CONFIG.endpoint}?serviceKey=${API_CONFIG.serviceKey}&type=${API_CONFIG.type}&numOfRows=${API_CONFIG.numOfRows}`;

        // 1. 직접 시도
        try {
            console.log('Attempting direct fetch...');
            const response = await fetch(baseUrl);
            if (response.ok) return await response.json();
        } catch (e) {
            console.warn('Direct fetch failed:', e);
            lastError = e;
        }

        // 2. 프록시 시도
        for (const proxyFn of proxies) {
            try {
                const proxyUrl = proxyFn(baseUrl);
                console.log(`Attempting fetch via proxy: ${proxyUrl}`);
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const data = await response.json();
                    // allorigins 특유의 응답 구조 처리
                    if (typeof data.contents === 'string') {
                        return JSON.parse(data.contents);
                    }
                    return data;
                }
            } catch (e) {
                console.warn('Proxy fetch failed:', e);
                lastError = e;
            }
        }
        throw lastError || new Error('All fetch attempts failed');
    };

    try {
        const data = await fetchWithRetries();
        
        // API 응답 구조 확인
        const items = data.response?.body?.items || [];

        if (!items || items.length === 0) {
            displayMessage('현재 제공되는 축제 데이터가 없습니다.', false);
            return;
        }

        // 2. 날짜 기준 필터링 (0~14일 이내 시작)
        const filteredFestivals = filterFestivalsByDate(items);

        // 3. 화면 렌더링
        renderFestivals(filteredFestivals);

    } catch (error) {
        console.error('Final Fetch Error:', error);
        // 사용자 경험을 위해 API 실패 시 안내 문구와 함께 테스트 데이터를 보여줄 수 있는 버튼 등을 제안
        displayMessage(`데이터를 가져오는데 실패했습니다. (원인: ${error.message})<br><small>API 서버의 보안 정책으로 인해 직접 접속이 제한될 수 있습니다.</small>`, true);
    }
}

/**
 * 오늘 날짜 기준으로 0일 ~ 14일 사이에 시작하는 행사 필터링
 */
function filterFestivalsByDate(items) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); 

    const twoWeeksLater = new Date(now);
    twoWeeksLater.setDate(now.getDate() + 14);

    console.log(`Filtering between ${now.toISOString()} and ${twoWeeksLater.toISOString()}`);

    return items.filter(item => {
        if (!item.fstvlStartDate) return false;

        // "2026-03-27" 형태의 문자열을 Date 객체로 변환
        const startDate = new Date(item.fstvlStartDate);
        
        if (isNaN(startDate.getTime())) return false;

        // 시작일이 오늘 이후이고 2주 이내인 것만 선택
        // (단, API 데이터의 최신성이 떨어질 수 있으므로 범위를 조금 더 유연하게 잡을 수도 있음)
        return startDate >= now && startDate <= twoWeeksLater;
    }).sort((a, b) => new Date(a.fstvlStartDate) - new Date(b.fstvlStartDate));
}

/**
 * 필터링된 데이터를 HTML 카드로 생성하여 화면에 표시
 */
function renderFestivals(festivals) {
    const grid = document.getElementById('festival-grid');
    grid.innerHTML = ''; 

    if (festivals.length === 0) {
        displayMessage('향후 2주 이내에 예정된 축제가 없습니다. 📅', false);
        return;
    }

    festivals.forEach(fest => {
        const card = document.createElement('div');
        card.className = 'festival-card';
        
        const dateRange = `${fest.fstvlStartDate} ~ ${fest.fstvlEndDate || '미정'}`;

        card.innerHTML = `
            <div>
                <h2 class="festival-name">${fest.fstvlNm}</h2>
                <div class="info-item">
                    <span class="info-label">📍 장소</span>
                    <span class="info-content">${fest.opar || '정보 없음'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📅 일정</span>
                    <span class="info-content">${dateRange}</span>
                </div>
            </div>
            <div class="date-badge">
                ${getDDay(fest.fstvlStartDate)}
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * D-Day 계산 유틸리티
 */
function getDDay(startDateStr) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(startDateStr);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return '오늘 시작!';
    if (diff < 0) return `진행 중 (D${diff})`;
    return `D-${diff}`;
}

/**
 * 상태 또는 에러 메시지 표시
 */
function displayMessage(message, isError) {
    const grid = document.getElementById('festival-grid');
    grid.innerHTML = `
        <div class="status-message ${isError ? 'error' : ''}">
            ${message}
        </div>
    `;
}
