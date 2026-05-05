import { useState } from "react";

export default function useCustomFunction() {
  const [location, setLocation] = useState(null);

  const fetchGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const updateLocation = (coords) => {
    const { latitude, longitude } = coords;
    const newPosition = { latitude, longitude };
    localStorage.setItem("position", JSON.stringify(newPosition));
    setLocation(newPosition);
    return newPosition;
  };

  const getGeolocation = async () => {
    const position = await fetchGeolocation();
    console.log("Geolocation fetched:", position.coords);
    return updateLocation(position.coords);
  };

  return { getGeolocation, location, setLocation };
}
