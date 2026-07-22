const axios = require('axios');

async function testRender() {
  const url = 'https://neurostay-ai.onrender.com/api/auth/forgot-password';
  console.log("Testing Render backend forgot password endpoint:", url);
  try {
    const res = await axios.post(url, { email: "munil8215@gmail.com" });
    console.log("Response Success Status:", res.status);
    console.log("Response Data:", res.data);
  } catch (error) {
    console.log("Response Error Status:", error.response?.status);
    console.log("Response Error Data:", error.response?.data);
    console.log("Full Error Message:", error.message);
  }
}

testRender();
