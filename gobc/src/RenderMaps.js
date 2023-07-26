import './App.css';
import { useState, useMemo} from "react";
import { GoogleMap, useLoadScript, MarkerF} from '@react-google-maps/api';

function CurrentLocation() {

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      setLat(Number(position.coords.latitude.toFixed(6)));
      setLong(Number(position.coords.longitude.toFixed(6)));
      
    });
  } else {
    console.log("geolocation not available"); 
  }

  return (
    <RenderGoogleMap lat={lat} long={long}/>
  )
}

export function RenderGoogleMap({lat, long}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if(!isLoaded) return <div>loading</div>;
  return <Map latitude={lat} longitude={long} />; 
}

function Map({latitude, longitude}) {
  const center = useMemo(() => ({
    lat: latitude, lng: longitude,
  }), [latitude, longitude]);

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
)}

function RenderMaps() {
  return (
    <CurrentLocation />
  )
}

export default RenderMaps;