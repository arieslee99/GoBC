import './App.css';
import type {Stop} from "./App";
import { useState, useEffect} from "react";
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { BsFillArrowRightCircleFill, BsArrowLeftRight} from "react-icons/bs";
import Badge from 'react-bootstrap/Badge';


interface Schedules {
  busses: []; //JSON array
}

export function GetData(s:Stop) {
    const scheds: Schedules = {
      busses: []
    }

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
  
      setLoading(true);
      const BASE_URL = "https://api.translink.ca"
      const SEARCH_PATH = s.busStopNumber;
      let FINAL_URL = `${BASE_URL}/rttiapi/v1/stops/${SEARCH_PATH}/estimates?apikey=${process.env.REACT_APP_TRANSLINK_API}`;
  
      fetch(FINAL_URL, {headers}) 
      .then((response) => response.json())
      .then(setData)
      .then(() => {setLoading(false)})
      .catch(setError);
    }, [s.busStopNumber]);
    
    if (loading) {
      return <Spinner animation="border"/>;
    }
    if (error) {
      return <pre>{JSON.stringify(error)}</pre>;
    }
    if (!data) {
      return null;
    }
    
    //handing undefined 
    scheds.busses = data === undefined ? []: data;

    return (
      //<pre>{JSON.stringify(data, null, 2)}</pre>
      Schedule(scheds.busses)
    )
  }

  function Schedule(scheds: []) {
    let busses = JSON.parse(JSON.stringify(scheds)); 

    return (
      <ListGroup variant="info"> 
        {BusTabs(busses)}
      </ListGroup>
    )
  }

  export function BusTabs(busses : []) {
    let busTimes = [];
    for(let i = 0; i < busses.length; i++) {
      busTimes.push(
      <ListGroup.Item key={i} as="li" className="d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
          <div style={{fontSize: 15}}className="fw-bold">
            <h1>{busses[i]["RouteNo"]}</h1>
  
            <div style={{padding: "5px"}}>
              <BsFillArrowRightCircleFill style={{marginRight: 5}}/>
              {busses[i]["Schedules"][0]["Destination"]}
  
              <Badge style={{fontSize: 13, marginLeft: "10px", color: "black"}} bg="warning" pill>
                {CalculateTime(busses[i]["Schedules"][0]["ExpectedLeaveTime"])}
              </Badge>
            </div>
  
            <BsArrowLeftRight style={{marginRight: 5}}/>
            {busses[i]["RouteName"]}
            
          </div>
          {Bus(busses[i]["Schedules"])}
        </div>
      </ListGroup.Item>
    )}
    
    return busTimes;
  }

  export function Bus(scheduleArray: []) {
    const busTimes = [];
    for(let i = 0; i < scheduleArray.length; i++) {
      let str : String = scheduleArray[i]['ExpectedLeaveTime'];
      
      busTimes.push(
        <ListGroup.Item action variant="light" style={{marginRight: 5, marginLeft: 5}} key={i}>
          {str.substring(0,7)}</ListGroup.Item>
      )
    }
    return (
      <ListGroup horizontal="sm" style={{padding: "10px"}}>
        {busTimes}
      </ListGroup>
    )
  }

  function CalculateTime(nextBus: string) {
    //numbers
    let today = new Date();
    let mins = today.getMinutes();
    let hours = today.getHours();
    if(hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    //strings
    let nextBusMins;
    let nextBusHours;
  
    if(nextBus.length === 18 || nextBus.length === 7) {
      nextBus = nextBus.substring(0, 8);
      nextBusMins = nextBus.substring(3,5);
      nextBusHours = nextBus.substring(0,2);
    } else {
      nextBus = nextBus.substring(0, 7);
      nextBusMins = nextBus.substring(2,4);
      nextBusHours = nextBus.substring(0,1);
    }

    let diff;
    if(nextBusHours.toString() === hours.toString()) {
      if(mins.toString()[0] === "0" && nextBusMins[0] === "0") {
        diff = Math.max(parseInt(mins.toString()[1]), parseInt(nextBusMins[1])) - Math.min(parseInt(mins.toString()[1]), parseInt(nextBusMins[1]));
      } else if (mins.toString()[0] === "0") {
        diff = parseInt(nextBusMins) - parseInt(mins.toString()[1]);
      } else if (nextBusMins[0] === "0") {
        diff = mins - parseInt(nextBusMins[1]);
      } else {
        diff = (Math.max(mins, parseInt(nextBusMins)) - (Math.min(mins, parseInt(nextBusMins))));
      }
    } else {
       let x = 60 - (Math.max(mins, parseInt(nextBusMins)));
        diff = x + (Math.min(mins, parseInt(nextBusMins)));
    }



    //   if(Array.from(mins)[0] === 0 && Array.from(nextBusMins)[0] === 0) {
    //     diff = (Math.max(Array.from(nextBusMins)[1], Array.from(mins)[1])) - (Math.min(Array.from(nextBusMins)[1], Array.from(mins)[1]));
    //   } else if (Array.from(mins)[0] === 0) {
    //     diff = nextBusMins - Array.from(mins)[1];
    //   } else if (Array.from(nextBusMins)[0] === 0){
    //     diff = mins - Array.from(nextBusMins)[1];
    //   } else {
    //     diff = (Math.max(mins, nextBusMins)) - (Math.min(mins, nextBusMins));
    //   }
    // } else {
    //     let x = 60 - (Math.max(mins, nextBusMins));
    //     diff = x + (Math.min(mins, nextBusMins));
    // }
    
    return (
      "Leaving in " + diff + " minutes"
    )
  }

function RenderBusses(s: Stop) {
    return (
      GetData(s)
    )
  }

export default RenderBusses;

