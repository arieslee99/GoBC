import './App.css';
import RenderBusses from './RenderBusses';
import CurrentLocation from './RenderMaps';
import CurrentLocationSched from './RenderAutoBusses';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import { MdDarkMode } from "react-icons/md";
import { useState} from "react";

function ByBusStop() {
  const [input, setInput] = useState('');
  const [updated, setUpdated] = useState(input);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUpdated(input);

  };

  return (
    <div>
    <form className='FormTraits' onSubmit={handleSubmit}>
        <p>Enter Bus Stop number:</p>
        <input style={{borderRadius: "7px", marginRight: "15px", padding: "8px"}} size="lg" id="bnum" type="text" value={input} placeholder="Bus Stop Number" onChange={handleChange} />
        <Button style={{backgroundColor: "navyblue", border: "none", padding: "8px"}}type="submit">Check Schedule</Button>
    </form>
      <RenderBusses stop={updated} />
    </div>
  )
}

function SearchOptions() {
  const [lat, setLat] = useState(0.000000);
  const [long, setLong] = useState(0.000000);

  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      setLat(Number(position.coords.latitude.toFixed(6)));
      setLong(Number(position.coords.longitude.toFixed(6)));
    });
  }

  let location = {
    lat: lat,
    lng: long
  }

  const [change, setChange] = useState(false);
  const handleChange = (event) => {
    event.preventDefault();
    setChange(true)
    window.location.reload(change)
    setChange(false)
  }

  const [darkmode, setDarkmode] = useState(false);
  const [mode, setMode] = useState("light");
  const handleMode = (event) => {
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
      {/* darkmode: data-bs-theme="dark" */}
      <Offcanvas show={true} backdrop={false} scroll={true} data-bs-theme={mode}>
        <Offcanvas.Header>
          <Offcanvas.Title as="h1" style={{fontWeight: "bold", fontSize: "75px", cursor: "pointer"}} onClick={handleChange}>
            Go<i style={{color: "cornflowerblue"}} >BC</i>
          </Offcanvas.Title>
          <div class="form-check form-switch" >
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onMouseDown={handleMode}></input>
          </div>
        </Offcanvas.Header >
        <Offcanvas.Body >
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Near You">
            <CurrentLocationSched CurrentLocation={location}/>
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
      <CurrentLocation />
      <SearchOptions />
    </div>
  )
}

export default App;
