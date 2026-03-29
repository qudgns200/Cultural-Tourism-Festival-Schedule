export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. API 데이터 요청 처리 (반드시 전용 경로 사용)
    if (url.pathname === "/api/festivals") {
      const serviceKey = 'a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890';
      const baseUrl = 'http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';
      
      let allItems = [];
      const today = new Date();

      const fetchPromises = [];
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dateStr = targetDate.toISOString().split('T')[0];
        
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

    // 2. /list.html 접속 시 파일 서빙
    if (url.pathname === "/list.html") {
      return env.ASSETS.fetch(request);
    }

    // 3. 첫 접속 (/) 포함 나머지 모든 요청은 index.html 서빙
    return env.ASSETS.fetch(request);
  }
}
