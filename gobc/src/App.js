import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from "react";
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

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

  
  // return (
  // <pre>{JSON.stringify(data, null, 2)}</pre>
  //<p>Please enter a valid 5 digit bus stop number.</p>

  // //<p>{scheduleObj[0].Schedules[0].ExpectedLeaveTime}</p>

  //<Schedule schedule={data} />
  
  
}

function BusTabs({busses}) {
  console.log(busses.length);

  let busTimes = [];
  for(let i = 0; i < busses.length; i++) {
    busTimes.push(
    <ListGroup.Item as="li" classname="d-flex justify-content-between align-items-start">
      <div className="ms-2 me-auto">
        <div style={{fontSize: 15}}className="fw-bold">{busses[i].RouteNo}: {busses[i].RouteName}
          <Badge style={{fontSize: 13, marginLeft: "10px", color: "black"}} bg="warning" pill>
            <CalculateTime nextBus={busses[i].Schedules[0].ExpectedLeaveTime}/>
          </Badge>     
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
  let time = today.getHours() + ":" + today.getMinutes(); 
  let nextBusTime = nextBus.substring(0,5);

  

  return (
    "Leaving in " + time + " minutes"
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

  return (
    <div>
      <h1 className='App'>Go<i style={{color: "cornflowerblue"}}>BC</i></h1>
      <SearchOptions />
    </div>

  )
}

export default App;
