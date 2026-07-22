const axios = require('axios');

async function testProductionEndpoint() {
  const url = 'https://neurostay-ai.onrender.com/api/auth/forgot-password';
  console.log("=================================================");
  console.log(" TESTING RENDER PRODUCTION FORGOT-PASSWORD API   ");
  console.log(" URL:", url);
  console.log("=================================================");

  const startTime = Date.now();
  try {
    const res = await axios.post(
      url,
      { email: "munil8215@gmail.com" },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 40000,
      }
    );
    const duration = Date.now() - startTime;
    console.log(`\n[SUCCESS] Response received in ${duration} ms!`);
    console.log("Status Code:", res.status);
    console.log("Response Data:", JSON.stringify(res.data, null, 2));
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`\n[FAILED] Request failed after ${duration} ms`);
    if (error.response) {
      console.log("Status Code:", error.response.status);
      console.log("Response Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error Message:", error.message);
    }
  }
}

testProductionEndpoint();
