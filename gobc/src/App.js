import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect, useMemo } from "react";
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { BsFillArrowRightCircleFill, BsArrowLeftRight} from "react-icons/bs";
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

function Schedule({schedule}) {
  const obj = JSON.parse(JSON.stringify(schedule)); 

  return (
    <ListGroup variant="info"> 
      <BusTabs busses= {obj}/>
    </ListGroup>
  )
}

function GetData({busStop}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    setLoading(true);
    const BASE_URL = "https://api.translink.ca"
    const SEARCH_PATH = busStop;
    let FINAL_URL = `${BASE_URL}/rttiapi/v1/stops/${SEARCH_PATH}/estimates?apikey=MfbIeYyUTRdAUbp20RRP`;

    fetch(FINAL_URL, {headers}) 
    .then((response) => response.json())
    .then(setData)
    .then(() => {setLoading(false)})
    .catch(setError);
  }, [busStop]);
  
  if (loading) return <Spinner animation="grow"/>
  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data) return null; 

  return (
    //<pre>{JSON.stringify(data, null, 2)}</pre>
    <Schedule schedule={data}/>
  )
}

function BusTabs({busses}) {
  let busTimes = [];
  for(let i = 0; i < busses.length; i++) {
    busTimes.push(
    <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
      <div className="ms-2 me-auto">
        <div style={{fontSize: 15}}className="fw-bold">
          <h1>{busses[i].RouteNo}</h1>

          <div style={{padding: "5px"}}>
            <BsFillArrowRightCircleFill style={{marginRight: 5}}/>
            {busses[i].Schedules[i].Destination}
            <Badge style={{fontSize: 13, marginLeft: "10px", color: "black"}} bg="warning" pill>
              <CalculateTime nextBus={busses[i].Schedules[0].ExpectedLeaveTime}/>
            </Badge>
          </div>

          <BsArrowLeftRight style={{marginRight: 5}}/>
          {busses[i].RouteName}
          
        </div>

        <Bus scheduleArray={busses[i].Schedules} />
      </div>
    </ListGroup.Item>
  )}
  return busTimes;
}

function Bus({scheduleArray}) {
  const busTimes = [];
  for(let i = 0; i < scheduleArray.length; i++) {
    let str = scheduleArray[i].ExpectedLeaveTime;
    
    busTimes.push(
      <ListGroup.Item action variant="light" style={{marginRight: 5, marginLeft: 5}}>
        {str.substring(0,7)}</ListGroup.Item>
    )
  }
  return (
    <ListGroup horizontal="sm" style={{padding: "10px"}}>
      {busTimes}
    </ListGroup>
  )
}

function CalculateTime({nextBus}) {
  let today = new Date();
  
  let mins = today.getMinutes();
  let hours = today.getHours() - 12;
  let nextBusMins;
  let nextBusHours;

  if(nextBus.length === 7) {
    nextBusMins = nextBus.substring(3,5);
    nextBusHours = nextBus.substring(0,2);
  } else {
    nextBusMins = nextBus.substring(2,4);
    nextBusHours = nextBus.substring(0,1);
  }

  let diff = 0;
 
  if(nextBusHours.toString() === hours.toString()) {
    if(Array.from(mins)[0] === 0 && Array.from(nextBusMins)[0] === 0) {
      diff = (Math.max(Array.from(nextBusMins)[1], Array.from(mins)[1])) - (Math.min(Array.from(nextBusMins)[1], Array.from(mins)[1]));
    } else if (Array.from(mins)[0] === 0) {
      diff = nextBusMins - Array.from(mins)[1];
    } else if (Array.from(nextBusMins)[0] === 0){
      diff = mins - Array.from(nextBusMins)[1];
    } else {
      diff = (Math.max(mins, nextBusMins)) - (Math.min(mins, nextBusMins));
    }
  } else {
      let x = 60 - (Math.max(mins, nextBusMins));
      diff = x + (Math.min(mins, nextBusMins));
  }
  
  return (
    "Leaving in " + diff + " minutes"
  )
}

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <Button
      type="button"
      size="lg"
      style={{ backgroundColor: 'navyblue' }}
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

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
      <GetData busStop={updated}/>
    </div>
  )
}

function SearchOptions() {
  return (
    <Accordion defaultActiveKey="0">
      <Card style={{border: "none"}}>
        <Card.Header style={{border: "none"}}>
          <CustomToggle eventKey="0">Bus Stop Number</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ByBusStop />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card style={{border: "none"}}>
        <Card.Header style={{border: "none"}}>
          <CustomToggle eventKey="1">Bus Id</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

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
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if(!isLoaded) return <div>loading</div>;
  return <Map latitude={lat} longitude={long} />; 
}

function Map({latitude, longitude}) {
  const center = useMemo(() => ({
    lat: latitude, lng: longitude,
  }), [latitude, longitude]);

  return (
    <GoogleMap 
      zoom={20}
      center={center}
      mapContainerClassName="map-container"
    >
      <MarkerF position={center} />
    </GoogleMap>

)}

function App() {
  //58624

  return (
    <div>
      <h1 className='App'>Go<i style={{color: "cornflowerblue"}}>BC</i></h1>
      <CurrentLocation />
      <SearchOptions />
    </div>

  )
}
export default App;
