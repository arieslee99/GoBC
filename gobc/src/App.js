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
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';

function Schedule({schedule}) {
  const obj = JSON.parse(JSON.stringify(schedule)); 
  ///.log(obj.length);
  // const busses = [];
  // for(let i = 0; i < obj.length; i++) {
  //   busses.push (
  //   <ul style={{backgroundColor: "lightyellow", fontWeight: "bold"}}>
  //     {obj[i].RouteNo}: {obj[i].RouteName}
  //   </ul>
  //   )
  //   for(let j = 0; j < obj[i].Schedules.length; j++) {
  //     busses.push(
  //         <ul>
  //           Departure Times: {obj[i].Schedules[j].ExpectedLeaveTime}
  //         </ul>
  //     )
  //   }
  // }

  return (
    // <ul>
    //   {busses}
    // </ul>
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
        <div className="fw-bold">{busses[i].RouteNo}: {busses[i].RouteName}</div>
        <Bus scheduleArray={busses[i].Schedules} />
      </div>
      <Badge style={{fontSize: 15, backgroundColor: "green"}}bg="primary" pill>
        Leaving in 14 minutes
      </Badge>
    </ListGroup.Item>
  )}
console.log(busTimes);
  return busTimes;
}

function Bus({scheduleArray}) {
  console.log("in bus");
  const busTimes = [];
  for(let i = 0; i < scheduleArray.length; i++) {
    busTimes.push(
      <ul>
        {scheduleArray[i].ExpectedLeaveTime}
      </ul>
    )
  }

  return (
    <ul>
      {busTimes}
    </ul>
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
