import RenderBusses from "./RenderBusses";
import type { Stop } from "./App";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import { BsFillPinMapFill } from "react-icons/bs";
import { useState, useEffect } from "react";

interface Station {
  stations: Array<any>;
}

function CurrentLocationSched(CurrentLocation: google.maps.LatLngLiteral) {
  let st: Station = {
    stations: [],
  };

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/JSON");
    headers.append("Accept", "application/JSON");

    setLoading(true);

    const BASE_URL = "https://api.translink.ca";

    let URL = `${BASE_URL}/rttiapi/v1/stops?apikey=${process.env.REACT_APP_TRANSLINK_API}&lat=${CurrentLocation.lat}&long=${CurrentLocation.lng}&radius=500`;
    fetch(URL, { headers })
      .then((response) => response.json())
      .then(setData)
      .then(() => {
        setLoading(false);
      })
      .catch(setError);
  }, [CurrentLocation.lat, CurrentLocation.lng]);

  if (loading)
    return (
      <div>
        <Spinner animation="border" />
      </div>
    );
  if (error) return <pre>{JSON.stringify(error)}</pre>;
  if (!data) return null;

  st.stations = data === undefined ? [] : data;
  return <NearbyStations stations={st.stations} />;
}

function NearbyStations(st: Station) {
  let obj = JSON.parse(JSON.stringify(st.stations));
  let s: Station = {
    stations: obj,
  };
  return <Schedules stations={s.stations} />;
}

function Schedules(s: Station) {
  let busTimes = [];

  for (let i = 0; i < s.stations.length; i++) {
    let sh = s.stations[i]["StopNo"];
    let name = s.stations[i]["Name"];
    const stop: Stop = {
      busStopNumber: sh,
    };

    busTimes.push(
      <ListGroup variant="info">
        <div
          style={{ fontSize: 15, paddingBottom: "30px" }}
          className="fw-bold"
        >
          <Badge
            style={{ fontSize: 15, color: "white", paddingBottom: 2 }}
            bg="primary"
            pill
          >
            <BsFillPinMapFill style={{ marginRight: 7, marginBottom: 7 }} />
            {name}
          </Badge>
          <RenderBusses busStopNumber={stop.busStopNumber} />
        </div>
      </ListGroup>
    );
  }
  return <>{busTimes}</>;
}

export default CurrentLocationSched;
