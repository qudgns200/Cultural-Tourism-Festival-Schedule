export async function onRequest(context) {
  const serviceKey = 'a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890';
  const baseUrl = 'https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api';
  
  let allItems = [];
  const today = new Date();

  // 향후 7일간의 데이터 가져오기
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const dateStr = targetDate.toISOString().split('T')[0];

    const apiUrl = `${baseUrl}?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&type=JSON&fstvlStartDate=${dateStr}`;
    
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.response && data.response.body && data.response.body.items) {
        allItems = allItems.concat(data.response.body.items);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 중복 제거
  const uniqueFestivals = Array.from(new Map(allItems.map(item => [item.fstvlNm, item])).values());
  
  return new Response(JSON.stringify(uniqueFestivals), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" 
    }
  });
}
