"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bus = exports.BusTabs = exports.GetData = void 0;
require("./App.css");
var react_1 = require("react");
var Spinner_1 = require("react-bootstrap/Spinner");
var ListGroup_1 = require("react-bootstrap/ListGroup");
var bs_1 = require("react-icons/bs");
var Badge_1 = require("react-bootstrap/Badge");
function GetData(_a) {
    var busStop = _a.busStop;
    var _b = (0, react_1.useState)(null), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    (0, react_1.useEffect)(function () {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        setLoading(true);
        var BASE_URL = "https://api.translink.ca";
        var SEARCH_PATH = busStop;
        var FINAL_URL = "".concat(BASE_URL, "/rttiapi/v1/stops/").concat(SEARCH_PATH, "/estimates?apikey=").concat(process.env.REACT_APP_TRANSLINK_API);
        fetch(FINAL_URL, { headers: headers })
            .then(function (response) { return response.json(); })
            .then(setData)
            .then(function () { setLoading(false); })
            .catch(setError);
    }, [busStop]);
    if (loading)
        return <Spinner_1.default animation="grow"/>;
    if (error)
        return <pre>{JSON.stringify(error)}</pre>;
    if (!data)
        return null;
    return (
    //<pre>{JSON.stringify(data, null, 2)}</pre>
    <Schedule schedule={data}/>);
}
exports.GetData = GetData;
function Schedule(_a) {
    var schedule = _a.schedule;
    var obj = JSON.parse(JSON.stringify(schedule));
    return (<ListGroup_1.default variant="info"> 
        <BusTabs busses={obj}/>
      </ListGroup_1.default>);
}
function BusTabs(_a) {
    var busses = _a.busses;
    var busTimes = [];
    for (var i = 0; i < busses.length; i++) {
        busTimes.push(<ListGroup_1.default.Item as="li" className="d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
          <div style={{ fontSize: 15 }} className="fw-bold">
            <h1>{busses[i].RouteNo}</h1>
  
            <div style={{ padding: "5px" }}>
              <bs_1.BsFillArrowRightCircleFill style={{ marginRight: 5 }}/>
              {busses[i].Schedules[i].Destination}
              <Badge_1.default style={{ fontSize: 13, marginLeft: "10px", color: "black" }} bg="warning" pill>
                <CalculateTime nextBus={busses[i].Schedules[0].ExpectedLeaveTime}/>
              </Badge_1.default>
            </div>
  
            <bs_1.BsArrowLeftRight style={{ marginRight: 5 }}/>
            {busses[i].RouteName}
            
          </div>
  
          <Bus scheduleArray={busses[i].Schedules}/>
        </div>
      </ListGroup_1.default.Item>);
    }
    return busTimes;
}
exports.BusTabs = BusTabs;
function Bus(_a) {
    var scheduleArray = _a.scheduleArray;
    var busTimes = [];
    for (var i = 0; i < scheduleArray.length; i++) {
        var str = scheduleArray[i].ExpectedLeaveTime;
        busTimes.push(<ListGroup_1.default.Item action variant="light" style={{ marginRight: 5, marginLeft: 5 }}>
          {str.substring(0, 7)}</ListGroup_1.default.Item>);
    }
    return (<ListGroup_1.default horizontal="sm" style={{ padding: "10px" }}>
        {busTimes}
      </ListGroup_1.default>);
}
exports.Bus = Bus;
function CalculateTime(_a) {
    var nextBus = _a.nextBus;
    var today = new Date();
    var mins = today.getMinutes();
    var hours = today.getHours();
    if (hours > 12) {
        hours -= 12;
    }
    else if (hours === 0) {
        hours = 12;
    }
    var nextBusMins;
    var nextBusHours;
    if (nextBus.toString().length === 18 || nextBus.toString().length === 7) {
        nextBus = nextBus.substring(0, 8);
        nextBusMins = nextBus.substring(3, 5);
        nextBusHours = nextBus.substring(0, 2);
    }
    else {
        nextBus = nextBus.substring(0, 7);
        nextBusMins = nextBus.substring(2, 4);
        nextBusHours = nextBus.substring(0, 1);
    }
    var diff;
    if (nextBusHours.toString() === hours.toString()) {
        if (Array.from(mins)[0] === 0 && Array.from(nextBusMins)[0] === 0) {
            diff = (Math.max(Array.from(nextBusMins)[1], Array.from(mins)[1])) - (Math.min(Array.from(nextBusMins)[1], Array.from(mins)[1]));
        }
        else if (Array.from(mins)[0] === 0) {
            diff = nextBusMins - Array.from(mins)[1];
        }
        else if (Array.from(nextBusMins)[0] === 0) {
            diff = mins - Array.from(nextBusMins)[1];
        }
        else {
            diff = (Math.max(mins, nextBusMins)) - (Math.min(mins, nextBusMins));
        }
    }
    else {
        var x = 60 - (Math.max(mins, nextBusMins));
        diff = x + (Math.min(mins, nextBusMins));
    }
    return ("Leaving in " + diff + " minutes");
}
function RenderBusses(_a) {
    var stop = _a.stop;
    return (<GetData busStop={stop}/>);
}
exports.default = RenderBusses;
