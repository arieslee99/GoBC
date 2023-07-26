import './App.css';
import RenderBusses from './RenderBusses';
import CurrentLocation from './RenderMaps';
import RenderGoogleMap from './RenderMaps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import {BsFillPinMapFill } from "react-icons/bs";
import { useState, useEffect } from "react";

function ByBusStop() {
  const [input, setInput] = useState('');
  const [updated, setUpdated] = useState(input);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUpdated(input);

  };

  return (
    <div>
    <form className='FormTraits' onSubmit={handleSubmit}>
        <p>Enter Bus Stop number:</p>
        <input style={{borderRadius: "7px", marginRight: "15px", padding: "8px"}} size="lg" id="bnum" type="text" value={input} placeholder="Bus Stop Number" onChange={handleChange} />
        <Button style={{backgroundColor: "navyblue", border: "none", padding: "8px"}}type="submit">Check Schedule</Button>
    </form>
      <RenderBusses stop={updated} />
    </div>
  )
}

function SearchOptions() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      setLat(Number(position.coords.latitude.toFixed(6)));
      setLong(Number(position.coords.longitude.toFixed(6)));
      
    });
  }

  let location = {
    lat: lat,
    lng: long
  }

  return (
    <>
      <Offcanvas show={true} backdrop={false} scroll={true}>
        <Offcanvas.Header>
          <Offcanvas.Title as="h1" style={{fontWeight: "bold", fontSize: "75px"}}>
          Go<i style={{color: "cornflowerblue"}}>BC</i>
          </Offcanvas.Title>
        </Offcanvas.Header >
        <Offcanvas.Body >
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Your Location">
            <CurrentLocationSched CurrentLocation={location}/>
          </Tab>

          <Tab eventKey="profile" title="Search by Bus Stop">
            <ByBusStop />
          </Tab>
        </Tabs>

          
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

  function CurrentLocationSched({CurrentLocation}) {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const headers = new Headers();
    headers.append("Content-Type", "application/JSON");
    headers.append("Accept", "application/JSON");

    setLoading(true);

    const BASE_URL = "https://api.translink.ca";
    let URL =
      `${BASE_URL}/rttiapi/v1/stops?apikey=${process.env.REACT_APP_TRANSLINK_API}&lat=${CurrentLocation.lat}&long=${CurrentLocation.lng}&radius=50`;
      //49.168476
      //-123.136817
    fetch(URL, {headers}) 
    .then((response) => response.json())
    .then(setData)
    .then(() => {setLoading(false)})
    .catch(setError);
  }, [CurrentLocation]);


  if(loading) return <Spinner animation="grow"/>
  if(error) return <pre>{JSON.stringify(error)}</pre>
  if(!data) return null;

  return (
    // <pre>{JSON.stringify(data, null, 2)}</pre>
    <NearbyStations stations={data}/>
  )
}

function NearbyStations({stations}) {
  const obj = JSON.parse(JSON.stringify(stations));

  return (
    <Schedules busses = {obj}/>
  )
}

function Schedules({busses}) {
  let busTimes = [];
  for(let i = 0; i < busses.length; i++) {
    let stop = busses[i].StopNo;
    let name = busses[i].Name;
    busTimes.push(
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
        <div style={{fontSize: 15, paddingBottom: "30px"}}className="fw-bold">
          <Badge style={{fontSize: 15, color: "white"}} bg="primary" pill>
            <BsFillPinMapFill style={{marginRight: 7}}/>
            {name}
          </Badge>
          
          <RenderBusses stop={stop}/>
        </div>
      </ListGroup.Item>
    )
  }

  return busTimes;
}

function App() {
  //58624
  return (
    <div>
      <SearchOptions />
      <CurrentLocation />
    </div>

  )
}

export default App;
