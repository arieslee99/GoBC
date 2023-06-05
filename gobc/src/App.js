import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { GoogleMap, useLoadScript} from '@react-google-maps/api';
import { useMemo} from 'react';
import GoogleMapReact from 'google-map-react';

import { useState, useEffect } from "react";


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
   //<Bus busses={data.RouteNo}/>
   <pre>{JSON.stringify(data, null, 2)}</pre>
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


function App() {
  //58624
  // const {maploaded} = useLoadScript ( {
  //   googleMapsApiKey: 'AIzaSyDoTbWrdgYZ6h-zGuq8TFVi-kDKBHbkHEw'
  // });

  // const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
  const location = {
    address: '1600 Amphitheatre Parkway, Mountain View, california.',
    lat: 37.42216,
    lng: -122.08427,
  }

  return (

    <div>
      <h1 className='App'>Go<i style={{color: "cornflowerblue"}}>BC</i></h1>
      {/* {!maploaded ? <Spinner animation="grow"/> : 
       
        <GoogleMapReact
          bootstrapURLKeys={{key: 'AIzaSyDoTbWrdgYZ6h-zGuq8TFVi-kDKBHbkHEw' }}
          defaultCenter= {location}
          defaultZoom={10}
        />
      } */}
      <div>
        <GoogleMapReact
          bootstrapURLKeys={{key: 'AIzaSyDoTbWrdgYZ6h-zGuq8TFVi-kDKBHbkHEw' }}
          defaultCenter= {location}
          defaultZoom={10}>
        </GoogleMapReact>
        </div>

      <SearchOptions />

    </div>

  )
}

export default App;
