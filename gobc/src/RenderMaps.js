import './App.css';
import { useState, useMemo } from "react";
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
      zoom={20}
      center={center}
      mapContainerClassName="map-container"
    >
      <MarkerF position={center} />
    </GoogleMap>

    {/* <CurrentLocationSched CurrentLocation={center}/> */}

    </div>
)}

// function CurrentLocationSched({CurrentLocation}) {
//   let axios = require('axios');
//   let config = {
//     method: 'get',
//     url: 
//     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${CurrentLocation.lat}%2C${CurrentLocation.lng}&radius=1500&type=restaurant&keyword=cruise&key=${process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
//     headers: {}
//   };

//   axios(config)
//   .then(function(response) {
//     console.log(JSON.stringify(response.data));
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
// }

function RenderMaps() {
  return (
    <CurrentLocation />
  )
}

export default RenderMaps;