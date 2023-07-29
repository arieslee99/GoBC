import "./App.css";
import { useMemo } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

export type LatLong = {
  lat: number;
  long: number;
};

function CurrentLocation() {
  const latlong: LatLong = {
    lat: 0.0,
    long: 0.0,
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      latlong.lat = Number(position.coords.latitude.toFixed(6));
      latlong.long = Number(position.coords.longitude.toFixed(6));
    });
  } else {
    console.log("geolocation not available");
  }

  return RenderGoogleMap(latlong);
  // <RenderGoogleMap lat={lat} long={long}/>
}

export function RenderGoogleMap(latlong: LatLong) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>loading</div>;
  // return <Map latitude={lat} longitude={long}/>;
  return Map(latlong);
}

function Map(latlong: LatLong) {
  const center = useMemo(
    () => ({
      lat: latlong.lat,
      lng: latlong.long,
    }),
    [latlong]
  );

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
