import './App.css';
import { useState, useMemo, useEffect} from "react";
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import GetData from './RenderBusses';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

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
  const latitude = CurrentLocation.lat;
  const longitude = CurrentLocation.lng;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);



  useEffect(() => {

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    setLoading(true);

    const BASE_URL = "https://api.translink.ca"
    let URL =
    `${BASE_URL}/rttiapi/v1/stops?apikey=${process.env.REACT_APP_TRANSLINK_API}&lat=${49.168541}&long=${-123.136743}&radius=50`;
    
    fetch(URL, {headers}) 
    .then((response) => response.json())
    .then(setData)
    .then(() => {setLoading(false)})
    .catch(setError);
  }, [latitude, longitude]);


  if(loading) return <Spinner animation="grow"/>
  if(error) return <pre>{JSON.stringify(error)}</pre>
  if(!data) return null;

  return (
    //<pre>{JSON.stringify(data, null, 2)}</pre>
   <NearbyStations stations={data}/>
  )
  
  // useEffect(() => {
  //   setLoading(true);

  //   let URL =
  //   `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${CurrentLocation.lat}%2C${CurrentLocation.lng}&radius=50&type=transit_station&key=${process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;

  //   fetch(URL)
  //   .then((response) => response.json())
  //   .then(setData)
  //   .then(() => {setLoading(false)})
  //   .catch(setError);
  // }, [CurrentLocation]);

  // if(loading) return <Spinner animation="grow"/>
  // if(error) return <Spinner animation="grow"/>
  // if(!data) return null;

  // return(
  //   //<pre>{JSON.stringify(data, null, 2)}</pre>
  //   <NearbyStations stations={data.results}/>
  // )
}

function NearbyStations({stations}) {
  const obj = JSON.parse(JSON.stringify(stations));

  return (
    <ListGroup variant="info">
      <Schedules busses = {obj}/>
    </ListGroup>

  )
}

function Schedules({busses}) {
  let busTimes = [];
  for(let i = 0; i < busses.length; i++) {
    let stop = busses[i].StopNo;
    busTimes.push(
      <GetData busStop={stop}/>
    )
  }

  return busTimes;
}


function RenderMaps() {
  return (
    <CurrentLocation />
  )
}

export default RenderMaps;