import './App.css';
import RenderBusses from './RenderBusses';
import RenderMaps from './RenderMaps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Button from 'react-bootstrap/Button';
import { useState } from "react";


function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey);
  return (
    <Button
      type="button"
      size="lg"
      style={{ backgroundColor: 'navyblue' }}
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

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

  return (
    <>
      <Offcanvas show={true} backdrop={false} scroll={true}>
        <Offcanvas.Header>
          <Offcanvas.Title as="h1" style={{fontWeight: "bold", fontSize: "75px"}}>
          Go<i style={{color: "cornflowerblue"}}>BC</i>
          </Offcanvas.Title>
        </Offcanvas.Header >
        <Offcanvas.Body >
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Your Location">
            Tab content for Home
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
      <RenderMaps />
      
    </div>

  )
}
export default App;
