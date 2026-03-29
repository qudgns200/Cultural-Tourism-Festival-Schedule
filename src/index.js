export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. API 데이터 요청 처리 (/)
    if (url.pathname === "/") {
      // 이미 인코딩된 상태일 수 있는 서비스 키
      const serviceKey = 'a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890';
      const baseUrl = 'http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';
      
      let allItems = [];
      const today = new Date();

      const fetchPromises = [];
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dateStr = targetDate.toISOString().split('T')[0];
        
        // URLSearchParams 대신 문자열로 직접 조립 (인코딩 중복 방지)
        const apiUrl = `${baseUrl}?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&type=JSON&fstvlStartDate=${dateStr}`;
        
        fetchPromises.push(
          fetch(apiUrl)
            .then(async (res) => {
              const text = await res.text();
              try {
                if (text.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR')) return null;
                const data = JSON.parse(text);
                const items = data?.response?.body?.items;
                if (!items) return null;
                return Array.isArray(items) ? items : [items];
              } catch (e) {
                return null;
              }
            })
            .catch(() => null)
        );
      }

      const results = await Promise.all(fetchPromises);
      results.forEach(items => {
        if (items) allItems = allItems.concat(items);
      });

      // 중복 제거 및 정렬
      const uniqueFestivals = Array.from(new Map(allItems.map(item => [item.fstvlNm, item])).values());
      uniqueFestivals.sort((a, b) => a.fstvlNm.localeCompare(b.fstvlNm));
      
      return new Response(JSON.stringify(uniqueFestivals), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    }

    // 2. /list 또는 /list.html 접속 시 서빙
    if (url.pathname === "/list" || url.pathname === "/list.html") {
      return env.ASSETS.fetch(new Request(url.origin + "/list.html", request));
    }

    return env.ASSETS.fetch(request);
  }
}
