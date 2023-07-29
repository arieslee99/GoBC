import RenderBusses from './RenderBusses';
import type {LatLong} from './RenderMaps';
import type {Stop} from './App';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import {BsFillPinMapFill} from "react-icons/bs";
import { useState, useEffect } from "react";

interface Station {
  stations: [];
}

function CurrentLocationSched(CurrentLocation: LatLong) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const st : Station = {
      stations: []
    }
  
    useEffect(() => {
      const headers = new Headers();
      headers.append("Content-Type", "application/JSON");
      headers.append("Accept", "application/JSON");
  
      setLoading(true);
  
      const BASE_URL = "https://api.translink.ca";
  
      let URL =
        `${BASE_URL}/rttiapi/v1/stops?apikey=${process.env.REACT_APP_TRANSLINK_API}&lat=${CurrentLocation.lat}&long=${CurrentLocation.long}&radius=500`
      fetch(URL, {headers}) 
      .then((response) => response.json())
      .then(setData)
      .then(() => {setLoading(false)})
      .catch(setError);
    }, [CurrentLocation]);
  
  
    if(loading) return <Spinner animation="grow"/>
    if(error) return <pre>{JSON.stringify(error)}</pre>
    if(!data) return null;

    st.stations = data === undefined? []: data;

    return (
      NearbyStations(st.stations)
      // <NearbyStations stations={data}/>
    )
  }
  
  function NearbyStations(stations: []) {
    const obj = JSON.parse(JSON.stringify(stations));
    return (
      <> {
        Schedules(obj)
        // <Schedules busses = {obj}/>
      }</>
      
    )
  }
  
  function Schedules(busses: []) {
    let busTimes = [];
    const stop: Stop = {
      busStopNumber: ""
    }

    for(let i = 0; i < busses.length; i++) {
      let s = busses[i]["StopNo"];
      let name = busses[i]["Name"];
      stop.busStopNumber = s;

      busTimes.push(
        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
          <div style={{fontSize: 15, paddingBottom: "30px"}}className="fw-bold">
            <Badge style={{fontSize: 15, color: "white", paddingBottom: 2}} bg="primary" pill>
              <BsFillPinMapFill style={{marginRight: 7, marginBottom: 7}}/>
              {name}
            </Badge>
            {RenderBusses(stop)}
            {/* <RenderBusses stop={stop}/> */}
          </div>
        </ListGroup.Item>
      )
    }
    return busTimes;
  }

  export default CurrentLocationSched;