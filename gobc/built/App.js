"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
var RenderBusses_1 = require("./RenderBusses");
var RenderMaps_1 = require("./RenderMaps");
var RenderAutoBusses_1 = require("./RenderAutoBusses");
require("bootstrap/dist/css/bootstrap.min.css");
var Offcanvas_1 = require("react-bootstrap/Offcanvas");
var Tabs_1 = require("react-bootstrap/Tabs");
var Tab_1 = require("react-bootstrap/Tab");
var Button_1 = require("react-bootstrap/Button");
var react_1 = require("react");
function ByBusStop() {
    var _a = (0, react_1.useState)(''), input = _a[0], setInput = _a[1];
    var _b = (0, react_1.useState)(input), updated = _b[0], setUpdated = _b[1];
    var handleChange = function (event) {
        setInput(event.target.value);
    };
    var handleSubmit = function (event) {
        event.preventDefault();
        setUpdated(input);
    };
    return (<div>
    <form className='FormTraits' onSubmit={handleSubmit} style={{ marginBottom: "15px" }}>
        <p>Enter Bus Stop number:</p>
        <input style={{ borderRadius: "7px", marginRight: "15px", padding: "7px" }} size="lg" id="bnum" type="text" value={input} placeholder="Bus Stop Number" onChange={handleChange}/>
        <Button_1.default style={{ backgroundColor: "navyblue", border: "none", padding: "8px" }} type="submit">Check Schedule</Button_1.default>
    </form>
      <RenderBusses_1.default stop={updated}/>
    </div>);
}
function SearchOptions() {
    var _a = (0, react_1.useState)(0.000000), lat = _a[0], setLat = _a[1];
    var _b = (0, react_1.useState)(0.000000), long = _b[0], setLong = _b[1];
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLat(Number(position.coords.latitude.toFixed(6)));
            setLong(Number(position.coords.longitude.toFixed(6)));
        });
    }
    var location = {
        lat: lat,
        lng: long
    };
    var _c = (0, react_1.useState)(false), change = _c[0], setChange = _c[1];
    var handleChange = function (event) {
        event.preventDefault();
        setChange(true);
        window.location.reload(change);
        setChange(false);
    };
    var _d = (0, react_1.useState)(false), darkmode = _d[0], setDarkmode = _d[1];
    var _e = (0, react_1.useState)(""), mode = _e[0], setMode = _e[1];
    var handleMode = function (event) {
        event.preventDefault();
        setDarkmode(!darkmode);
        if (darkmode) {
            setMode("light");
        }
        else {
            setMode("dark");
        }
    };
    return (<>
      <Offcanvas_1.default show={true} backdrop={false} scroll={true} data-bs-theme={mode}>
        <Offcanvas_1.default.Header>
          <Offcanvas_1.default.Title as="h1" style={{ fontWeight: "bold", fontSize: "75px", cursor: "pointer" }} onClick={handleChange}>
            Go<i style={{ color: "cornflowerblue" }}>BC</i>
          </Offcanvas_1.default.Title>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onMouseDown={handleMode}></input>
          </div>
        </Offcanvas_1.default.Header>
        <Offcanvas_1.default.Body>
        <Tabs_1.default defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
          <Tab_1.default eventKey="home" title="Near You">
            <RenderAutoBusses_1.default CurrentLocation={location}/>
          </Tab_1.default>

          <Tab_1.default eventKey="profile" title="Search by Bus Stop">
            <ByBusStop />
          </Tab_1.default>
        </Tabs_1.default>

        </Offcanvas_1.default.Body>
      </Offcanvas_1.default>
    </>);
}
function App() {
    //58624
    return (<div>
      <SearchOptions />
      <RenderMaps_1.default />
    </div>);
}
exports.default = App;
