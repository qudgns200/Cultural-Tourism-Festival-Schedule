export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/festivals") {
      const serviceKey = env.SERVICE_KEY;
      const baseUrl = 'https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';
      const dateParam = url.searchParams.get('date');

      const fetchDay = (dateStr) =>
        fetch(`${baseUrl}?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&type=JSON&fstvlStartDate=${dateStr}`)
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
          .catch(() => null);

      const fetchPromises = [];

      if (dateParam) {
        // 선택일 기준 30일 이전까지 병렬 호출 후 선택일을 포함하는 축제만 필터링
        for (let i = 0; i <= 30; i++) {
          const d = new Date(dateParam);
          d.setDate(d.getDate() - i);
          fetchPromises.push(fetchDay(d.toISOString().split('T')[0]));
        }
      } else {
        // 기본: 오늘부터 7일
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          fetchPromises.push(fetchDay(d.toISOString().split('T')[0]));
        }
      }

      const results = await Promise.all(fetchPromises);
      let allItems = [];
      results.forEach(items => { if (items) allItems = allItems.concat(items); });

      if (dateParam) {
        allItems = allItems.filter(item => item.fstvlEndDate >= dateParam);
      }

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

    if (url.pathname === "/" || url.pathname === "") {
      return env.ASSETS.fetch(new Request(url.origin + "/index.html", request));
    }

    return env.ASSETS.fetch(request);
  }
}
