import "./App.css";
import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

export type LatLong = {
  lat: number;
  long: number;
};

function CurrentLocation() {
  const [latlong, setLatlong] = useState({
    lat: 0.0,
    long: 0.0,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatlong({
          lat: Number(position.coords.latitude.toFixed(6)),
          long: Number(position.coords.longitude.toFixed(6)),
        });
      });
    } else {
      console.log("geolocation not available");
    }
  }, []);

  return RenderGoogleMap(latlong);
}

export function RenderGoogleMap(latlong: LatLong) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>loading</div>;

  return Map(latlong);
}

function Map(latlong: LatLong) {
  const center = {
    lat: latlong.lat,
    lng: latlong.long,
  };

  return (
    <div>
      <GoogleMap
        zoom={18}
        center={center}
        mapContainerClassName="map-container"
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
}

function RenderMaps() {
  return <CurrentLocation />;
}

export default RenderMaps;
