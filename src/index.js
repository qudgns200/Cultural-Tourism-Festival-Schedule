export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. API 데이터 요청 처리 (/api/festivals)
    if (url.pathname === "/api/festivals") {
      const serviceKey = 'a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890';
      const baseUrl = 'https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';
      
      let allItems = [];
      const today = new Date();

      const fetchPromises = [];
      for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        const dateStr = targetDate.toISOString().split('T')[0];
        
        // URL 파라미터를 안전하게 생성
        const params = new URLSearchParams({
          serviceKey: serviceKey,
          pageNo: '1',
          numOfRows: '100',
          type: 'JSON',
          fstvlStartDate: dateStr
        });

        const apiUrl = `${baseUrl}?${params.toString()}`;
        
        fetchPromises.push(
          fetch(apiUrl)
            .then(async (res) => {
              if (!res.ok) return null;
              const text = await res.text();
              try {
                return JSON.parse(text);
              } catch (e) {
                console.error(`JSON Parse Error for ${dateStr}: ${text.substring(0, 100)}`);
                return null; // JSON이 아니면 무시
              }
            })
            .catch(() => null)
        );
      }

      const results = await Promise.all(fetchPromises);
      results.forEach(data => {
        if (data && data.response && data.response.body && data.response.body.items) {
          allItems = allItems.concat(data.response.body.items);
        }
      });

      // 축제명 기준 중복 제거
      const uniqueFestivals = Array.from(new Map(allItems.map(item => [item.fstvlNm, item])).values());
      
      return new Response(JSON.stringify(uniqueFestivals), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    }

    // 2. /list 접속 시 list.html 서빙
    if (url.pathname === "/list" || url.pathname === "/list.html") {
      return env.ASSETS.fetch(new Request(url.origin + "/list.html", request));
    }

    // 3. 나머지 요청은 ASSETS(정적 파일)에서 처리
    return env.ASSETS.fetch(request);
  }
}
