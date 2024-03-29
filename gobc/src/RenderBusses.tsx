import "./App.css";
import type { Stop } from "./App";
import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import { BsFillArrowRightCircleFill, BsArrowLeftRight } from "react-icons/bs";
import Badge from "react-bootstrap/Badge";

interface Schedules {
  busses: Array<any>; //JSON array
}

export function GetData(s: Stop) {
  let sh: Schedules = {
    busses: [],
  };

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    setLoading(true);
    const BASE_URL = "https://api.translink.ca";
    const SEARCH_PATH = s.busStopNumber;
    let FINAL_URL = `${BASE_URL}/rttiapi/v1/stops/${SEARCH_PATH}/estimates?apikey=${process.env.REACT_APP_TRANSLINK_API}`;

    fetch(FINAL_URL, { headers })
      .then((response) => response.json())
      .then(setData)
      .then(() => {
        setLoading(false);
      })
      .catch(setError);
  }, [s.busStopNumber]);

  if (loading) {
    return (
      <div>
        <Spinner animation="border" />
      </div>
    );
  }
  if (error) {
    return <pre>{JSON.stringify(error)}</pre>;
  }
  if (!data) {
    return null;
  }

  //handing undefined
  sh.busses = data === undefined ? [] : data;
  return <Schedule busses={sh.busses} />;
}

function Schedule(sh: Schedules) {
  let obj = JSON.parse(JSON.stringify(sh.busses));
  let s: Schedules = {
    busses: obj,
  };

  return (
    <ListGroup variant="info">
      <BusTabs busses={s.busses} />
    </ListGroup>
  );
}

export function BusTabs(s: Schedules) {
  let busTimes = [];

  for (let i = 0; i < s.busses.length; i++) {
    let scheduleArray: Schedules = {
      busses: s.busses[i]["Schedules"],
    };

    busTimes.push(
      <ListGroup.Item
        key={i}
        as="li"
        className="d-flex justify-content-between align-items-start"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <div className="ms-2 me-auto">
          <div style={{ fontSize: 15 }} className="fw-bold">
            <h1>{s.busses[i]["RouteNo"]}</h1>

            <div style={{ padding: "5px" }}>
              <BsFillArrowRightCircleFill style={{ marginRight: 5 }} />
              {s.busses[i]["Schedules"][0]["Destination"]}

              <Badge
                style={{ fontSize: 13, marginLeft: "10px", color: "black" }}
                bg="warning"
                pill
              >
                {calculateTime(
                  s.busses[i]["Schedules"][0]["ExpectedLeaveTime"]
                )}
              </Badge>
              <Badge
                style={{ fontSize: 13, marginLeft: "10px", color: "white" }}
                bg="success"
                pill
              >
                {onSchedule(s.busses[i]["Schedules"][0]["ExpectedLeaveTime"])}
              </Badge>
            </div>

            <BsArrowLeftRight style={{ marginRight: 5 }} />
            {s.busses[i]["RouteName"]}
          </div>
          <Bus busses={scheduleArray.busses} />
        </div>
      </ListGroup.Item>
    );
  }

  return <>{busTimes}</>;
}

export function Bus(scheduleArray: Schedules) {
  const busTimes = [];
  for (let i = 0; i < scheduleArray.busses.length; i++) {
    let str: String = scheduleArray.busses[i]["ExpectedLeaveTime"];

    busTimes.push(
      <ListGroup.Item
        action
        variant="light"
        style={{
          marginRight: 5,
          marginLeft: 5,
        }}
        key={i}
      >
        {str.substring(0, 7)}
      </ListGroup.Item>
    );
  }
  return (
    <ListGroup horizontal="sm" style={{ padding: "10px" }}>
      {busTimes}
    </ListGroup>
  );
}

function onSchedule(incoming: string) {
  //numbers
  let today = new Date();
  let mins = today.getMinutes();
  let hours = today.getHours();
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }
  let nextBusMins;
  let nextBusHours;

  //strings
  let message;
  if (incoming.length === 18 || incoming.length === 7) {
    incoming = incoming.substring(0, 8);
    if (incoming.substring(3, 4) === "0") {
      nextBusMins = incoming.substring(4, 5);
    } else {
      nextBusMins = incoming.substring(3, 5);
    }
    nextBusHours = incoming.substring(0, 2);
  } else if (incoming.length === 17) {
    incoming = incoming.substring(0, 4);
    nextBusMins = incoming.substring(2, 4);
    nextBusHours = incoming.substring(0, 1);
  } else {
    incoming = incoming.substring(0, 7);
    nextBusMins = incoming.substring(2, 4);
    nextBusHours = incoming.substring(0, 1);
  }

  if (nextBusMins[0] === "0") {
    nextBusMins.substring(1, 2);
  }

  let nextBusMinsNum = parseInt(nextBusMins);
  let nextBusHoursNum = parseInt(nextBusHours);

  console.log(hours);
  console.log(mins);
  console.log(incoming + " " + nextBusHoursNum);
  console.log(incoming + " " + nextBusMinsNum);

  if (
    (nextBusMinsNum < mins && nextBusHoursNum === hours) ||
    (nextBusHoursNum < hours && nextBusMinsNum > mins)
  ) {
    message = "Late";
  } else {
    message = "On time";
  }
  return message;
}

function calculateTime(nextBus: string) {
  //numbers
  let today = new Date();
  let mins = today.getMinutes();
  let hours = today.getHours();
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  //strings
  let nextBusMins;
  let nextBusHours;

  if (nextBus.length === 18 || nextBus.length === 7) {
    nextBus = nextBus.substring(0, 8);
    if (nextBus.substring(3, 4) === "0") {
      nextBusMins = nextBus.substring(4, 5);
    } else {
      nextBusMins = nextBus.substring(3, 5);
    }

    nextBusHours = nextBus.substring(0, 2);
  } else if (nextBus.length === 17) {
    nextBus = nextBus.substring(0, 4);
    nextBusMins = nextBus.substring(2, 4);
    nextBusHours = nextBus.substring(0, 1);
  } else {
    nextBus = nextBus.substring(0, 7);
    nextBusMins = nextBus.substring(2, 4);
    nextBusHours = nextBus.substring(0, 1);
  }

  let diff;
  if (nextBusHours.toString() === hours.toString()) {
    if (mins.toString()[0] === "0" && nextBusMins[0] === "0") {
      diff =
        Math.max(parseInt(mins.toString()[1]), parseInt(nextBusMins[1])) -
        Math.min(parseInt(mins.toString()[1]), parseInt(nextBusMins[1]));
    } else if (mins.toString()[0] === "0") {
      diff = parseInt(nextBusMins) - parseInt(mins.toString()[1]);
    } else if (nextBusMins[0] === "0") {
      diff = mins - parseInt(nextBusMins[1]);
    } else {
      diff =
        Math.max(mins, parseInt(nextBusMins)) -
        Math.min(mins, parseInt(nextBusMins));
    }
  } else {
    let x = 60 - Math.max(mins, parseInt(nextBusMins));
    diff = x + Math.min(mins, parseInt(nextBusMins));
  }

  return "Arriving in " + diff + " minutes";
}

function RenderBusses(s: Stop) {
  return <GetData busStopNumber={s.busStopNumber} />;
}

export default RenderBusses;
