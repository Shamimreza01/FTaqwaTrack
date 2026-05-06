export const getLocationName = async (latitude, longitude) => {
  const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results[0].formatted;
};

export const searchCity = async (text) => {
  if (!text) return [];
  const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&type=city&limit=5&lang=en&format=json&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("City search error:", error);
    return [];
  }
};
