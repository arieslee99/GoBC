import './App.css';
import { useState, useMemo, useEffect} from "react";
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

function CurrentLocation() {

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
      
    });
  } else {
    console.log("geolocation not available"); 
  }

  return (
    <RenderGoogleMap lat={lat} long={long}/>
  )

}

function RenderGoogleMap({lat, long}) {
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

    <CurrentLocationSched CurrentLocation={center}/>

    </div>
)}

function CurrentLocationSched({CurrentLocation}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  
  useEffect(() => {

    let URL = 
    `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${CurrentLocation.lat}%2C${CurrentLocation.lng}&radius=500&type=transit_station&key=${process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;

    fetch(URL)
    .then((response) => response.json())
    .then(setData)
    .catch(setError);
  }, [CurrentLocation]);

  if(error) return <pre>{JSON.stringify(error)}</pre>

  return(
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

function RenderMaps() {
  return (
    <CurrentLocation />
  )
}

export default RenderMaps;