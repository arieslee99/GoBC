import RenderBusses from './RenderBusses';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import {BsFillPinMapFill} from "react-icons/bs";
import { useState, useEffect } from "react";

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
        `${BASE_URL}/rttiapi/v1/stops?apikey=${process.env.REACT_APP_TRANSLINK_API}&lat=${CurrentLocation.lat}&long=${CurrentLocation.lng}&radius=500`
      fetch(URL, {headers}) 
      .then((response) => response.json())
      .then(setData)
      .then(() => {setLoading(false)})
      .catch(setError);
    }, [CurrentLocation]);
  
  
    if(loading) return <Spinner animation="grow"/>
    if(error) return <pre>{JSON.stringify(error)}</pre>
    if(typeof(data) == "undefined" || data === null) return null;
  
    return (
      <NearbyStations stations={data}/>
    )
  }
  
  function NearbyStations({stations}) {
    const obj = JSON.parse(JSON.stringify(stations));
    return (
      <> {
        Schedules(obj)
        // <Schedules busses = {obj}/>
      }</>
      
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
            <Badge style={{fontSize: 15, color: "white", paddingBottom: 2}} bg="primary" pill>
              <BsFillPinMapFill style={{marginRight: 7, marginBottom: 7}}/>
              {name}
            </Badge>
            
            <RenderBusses stop={stop}/>
          </div>
        </ListGroup.Item>
      )
    }
    return busTimes;
  }

  export default CurrentLocationSched;