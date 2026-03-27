export default {
  async fetch(request, env, ctx) {
    const SERVICE_KEY = "a927afc2f6eca450e11c1db2f30c6011600f238f313eb0a7c36294708698a890";
    const API_URL = `https://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&type=json`;

    // CORS Preflight (OPTIONS)
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
      console.log("Fetching from API URL:", API_URL);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      // response.text()로 먼저 받아서 디버깅 및 반환 처리
      const responseText = await response.text();
      
      console.log("API Response Status:", response.status);
      console.log("API Response Body:", responseText);

      if (!response.ok) {
        throw new Error(`외부 API 응답 오류 (Status: ${response.status})`);
      }

      return new Response(responseText, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (error) {
      console.error("Worker Error:", error.message);
      
      return new Response(JSON.stringify({ 
        error: "외부 API 응답 오류", 
        message: error.message 
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
