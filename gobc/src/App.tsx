import './App.css';
import RenderBusses from './RenderBusses';
import RenderMaps from './RenderMaps';
import CurrentLocationSched from './RenderAutoBusses';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import type {LatLong} from './RenderMaps';
import { useState} from "react";

type Stop = {
  busStopNumber: string;
};

function ByBusStop() {
  const s: Stop = {
    busStopNumber: ""
  }

  const [input, setInput] = useState("");
  const [updated, setUpdated] = useState(input);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setUpdated(input);
  };
  
  s.busStopNumber = updated;
  return (
    <div>
    <form className='FormTraits' onSubmit={handleSubmit} style={{marginBottom: "15px"}}>
        <p>Enter Bus Stop number:</p>
        <input style={{borderRadius: "7px", marginRight: "15px", padding: "7px"}} size={15} id="bnum" type="text" value={input} placeholder="Bus Stop Number" onChange={handleChange} />
        <Button style={{backgroundColor: "navyblue", border: "none", padding: "8px"}}type="submit">Check Schedule</Button>
    </form>
    {RenderBusses(s)}
    </div>
  )
}

function SearchOptions() {
  const [darkmode, setDarkmode] = useState(false);
  const [mode, setMode] = useState("");

  const currentSpot: LatLong = {
    lat: 0.000000,
    long: 0.000000
  }

  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      currentSpot.lat = (Number(position.coords.latitude.toFixed(6)));
      currentSpot.long = (Number(position.coords.longitude.toFixed(6)));
    });
  }
  
  const handleMode = (event: React.MouseEvent) => {
    event.preventDefault();
    setDarkmode(!darkmode);
    if(darkmode) {
      setMode("light");
    } else {
      setMode("dark");
    }
  }

  return (
    <>
      <Offcanvas show={true} backdrop={false} scroll={true} data-bs-theme={mode}>
        <Offcanvas.Header>
          <Offcanvas.Title as="h1" style={{fontWeight: "bold", fontSize: "75px", cursor: "pointer"}} onClick={() => window.location.reload()}>
            Go<i style={{color: "cornflowerblue"}} >BC</i>
          </Offcanvas.Title>
          <div className="form-check form-switch" >
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onMouseDown={handleMode}></input>
          </div>
        </Offcanvas.Header >
        <Offcanvas.Body >
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Near You">
            {/* {CurrentLocationSched(currentSpot)} */}
            {/* <CurrentLocationSched CurrentLocation={location}/> */}
          </Tab>

          <Tab eventKey="profile" title="Search by Bus Stop">
            <ByBusStop />
          </Tab>
        </Tabs>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}



function App() {
  //58624
  return (
    <div>
      <SearchOptions />
      {/* <RenderMaps /> */}
      
    </div>
  )
}

export default App;
export type {Stop};