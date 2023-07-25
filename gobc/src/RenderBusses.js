import './App.css';
import { useState, useEffect} from "react";
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { BsFillArrowRightCircleFill, BsArrowLeftRight} from "react-icons/bs";
import Badge from 'react-bootstrap/Badge';

export function GetData({busStop}) {
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
      let FINAL_URL = `${BASE_URL}/rttiapi/v1/stops/${SEARCH_PATH}/estimates?apikey=${process.env.REACT_APP_TRANSLINK_API}`;
  
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

  function Schedule({schedule}) {
    const obj = JSON.parse(JSON.stringify(schedule)); 

    return (
      <ListGroup variant="info"> 
        <BusTabs busses= {obj}/>
      </ListGroup>
    )
  }

  export function BusTabs({busses}) {
    let busTimes = [];
    for(let i = 0; i < busses.length; i++) {
      busTimes.push(
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
          <div style={{fontSize: 15}}className="fw-bold">
            <h1>{busses[i].RouteNo}</h1>
  
            <div style={{padding: "5px"}}>
              <BsFillArrowRightCircleFill style={{marginRight: 5}}/>
              {/* {busses[i].Schedules[i].Destination} */}
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

  export function Bus({scheduleArray}) {
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
    let hours = today.getHours();
    console.log(hours)
    if(hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    let nextBusMins;
    let nextBusHours;
  
    if(nextBus.toString().length === 18 || nextBus.toString().length === 7) {
      nextBus = nextBus.substring(0, 8);
      nextBusMins = nextBus.substring(3,5);
      nextBusHours = nextBus.substring(0,2);
    } else {
      nextBus = nextBus.substring(0, 7);
      nextBusMins = nextBus.substring(2,4);
      nextBusHours = nextBus.substring(0,1);
    }
    console.log(nextBusHours)

    let diff;
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

function RenderBusses({stop}) {

    return (
        <GetData busStop={stop} />
    )
  }

export default RenderBusses;

