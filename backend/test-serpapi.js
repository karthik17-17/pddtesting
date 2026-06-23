const axios = require('axios');

const normalizeQuery = (query) => {
  let q = query ? query.trim() : "";
  if (!q) return "hotels in Chennai India";
  q = q.replace(/tirupathi/gi, "Tirupati").replace(/srikalahasthi/gi, "Srikalahasti");
  const lower = q.toLowerCase();
  if (!lower.includes("hotel")) {
    const capitalized = q
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    q = `hotels in ${capitalized} India`;
  } else {
    if (!lower.includes("india")) {
      q = `${q} India`;
    }
  }
  return q.replace(/\s+/g, " ").trim();
};

const getCityName = (query) => {
  if (!query) return "Chennai";
  let city = query
    .replace(/(budget|luxury|family|cheap)?\s*hotels?\s+(in|near)\s+/gi, "")
    .replace(/\b(india)\b/gi, "")
    .replace(/,/g, "")
    .trim();
  city = city.split(/\s+(with|under|for)\s+/i)[0].trim();
  city = city.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  return city || "Chennai";
};

async function test() {
  const query = "tirupathi";
  const city = getCityName(query);
  const normalizedQuery = normalizeQuery(query);
  console.log({ query, city, normalizedQuery });

  const headers = {
    "User-Agent": "NeuroStayAI/1.0 (contact: support@neurostay.ai)"
  };

  let osmData = [];
  const queries = [
    `hotels in ${city}`,
    `lodging in ${city}`,
    `guest houses in ${city}`,
    `lodges in ${city}`
  ];
  
  for (const q of queries) {
    try {
      console.log(`Querying OSM Nominatim for "${q}"...`);
      const osmResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=30&addressdetails=1`,
        { headers, timeout: 8000 }
      );
      
      console.log(`Response length for "${q}":`, osmResponse.data.length);
      if (osmResponse.data && osmResponse.data.length > 0) {
        osmData = osmResponse.data;
        break;
      }
    } catch (error) {
      console.log(`OSM query failed:`, error.message);
    }
  }

  console.log("Found raw OSM hotels count:", osmData.length);
  if (osmData.length > 0) {
    console.log("Sample OSM hotel name:", osmData[0].name, "display_name:", osmData[0].display_name);
  }

  const forbiddenKeywords = [
    "closest hotels", "budget hotels near", "hotels near", "top hotels", "best hotels",
    "goibibo", "makemytrip", "tripadvisor", "list", "search results", "agoda", "booking.com"
  ];

  let filtered = osmData.filter(h => {
    const name = h.name || h.title || (h.display_name ? h.display_name.split(',')[0] : "");
    if (!name || name.toLowerCase() === "hotel") return false;
    const nameLower = name.toLowerCase();
    for (const keyword of forbiddenKeywords) {
      if (nameLower.includes(keyword)) return false;
    }
    return true;
  });

  console.log("Filtered count after keywords:", filtered.length);

  if (filtered.length === 0 && osmData.length > 0) {
    console.log("Bypassing keyword filters since all results were removed.");
    filtered = osmData.filter(h => {
      const name = h.name || h.title || (h.display_name ? h.display_name.split(',')[0] : "");
      return name && name.toLowerCase() !== "hotel";
    });
  }

  console.log("Final count:", filtered.length);
}

test().catch(console.error);
