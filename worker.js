/**
 * Cloudflare Worker: API Proxy for Public Data Portal
 * CORS 문제를 해결하고 공공데이터 API를 안전하게 전달합니다.
 */
export default {
  async fetch(request, env, ctx) {
    const API_URL = "https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api";
    const SERVICE_KEY = "a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890";

    // CORS Preflight (OPTIONS) 요청 처리
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      // 외부 API 호출 (쿼리 파라미터 조합)
      const targetUrl = `${API_URL}?serviceKey=${SERVICE_KEY}&type=json&numOfRows=100`;
      const response = await fetch(targetUrl);
      
      if (!response.ok) throw new Error("외부 API 응답 오류");

      const data = await response.json();

      // 결과 반환 및 CORS 헤더 추가
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // 브라우저 접근 허용
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }
  },
};
