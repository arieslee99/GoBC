"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RenderBusses_1 = require("./RenderBusses");
var Badge_1 = require("react-bootstrap/Badge");
var ListGroup_1 = require("react-bootstrap/ListGroup");
var Spinner_1 = require("react-bootstrap/Spinner");
var bs_1 = require("react-icons/bs");
var react_1 = require("react");
function CurrentLocationSched(_a) {
    var CurrentLocation = _a.CurrentLocation;
    var _b = (0, react_1.useState)(null), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    (0, react_1.useEffect)(function () {
        var headers = new Headers();
        headers.append("Content-Type", "application/JSON");
        headers.append("Accept", "application/JSON");
        setLoading(true);
        var BASE_URL = "https://api.translink.ca";
        var URL = "".concat(BASE_URL, "/rttiapi/v1/stops?apikey=").concat(process.env.REACT_APP_TRANSLINK_API, "&lat=").concat(CurrentLocation.lat, "&long=").concat(CurrentLocation.lng, "&radius=500");
        fetch(URL, { headers: headers })
            .then(function (response) { return response.json(); })
            .then(setData)
            .then(function () { setLoading(false); })
            .catch(setError);
    }, [CurrentLocation]);
    if (loading)
        return <Spinner_1.default animation="grow"/>;
    if (error)
        return <pre>{JSON.stringify(error)}</pre>;
    if (!data)
        return null;
    return (<NearbyStations stations={data}/>);
}
function NearbyStations(_a) {
    var stations = _a.stations;
    var obj = JSON.parse(JSON.stringify(stations));
    return (<Schedules busses={obj}/>);
}
function Schedules(_a) {
    var busses = _a.busses;
    var busTimes = [];
    for (var i = 0; i < busses.length; i++) {
        var stop_1 = busses[i].StopNo;
        var name_1 = busses[i].Name;
        busTimes.push(<ListGroup_1.default.Item as="li" className="d-flex justify-content-between align-items-start">
          <div style={{ fontSize: 15, paddingBottom: "30px" }} className="fw-bold">
            <Badge_1.default style={{ fontSize: 15, color: "white", paddingBottom: 2 }} bg="primary" pill>
              <bs_1.BsFillPinMapFill style={{ marginRight: 7, marginBottom: 7 }}/>
              {name_1}
            </Badge_1.default>
            
            <RenderBusses_1.default stop={stop_1}/>
          </div>
        </ListGroup_1.default.Item>);
    }
    return busTimes;
}
exports.default = CurrentLocationSched;
