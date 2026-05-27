const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080";

export const searchHotels = async (query: string) => {
  try {
    const response = await fetch(
      `${API_URL}/api/hotels/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(error);

    return [];
  }
};