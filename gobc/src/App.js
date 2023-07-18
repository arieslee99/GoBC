import './App.css';
import RenderBusses from './RenderBusses';
import RenderMaps from './RenderMaps';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
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
    <Accordion defaultActiveKey="0">
      <Card style={{border: "none"}}>
        <Card.Header style={{border: "none"}}>
          <CustomToggle eventKey="0">Bus Stop Number</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ByBusStop />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card style={{border: "none"}}>
        <Card.Header style={{border: "none"}}>
          <CustomToggle eventKey="1">Bus Id</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>Hello! I'm another body</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

function App() {
  //58624
  return (
    <div>
      <h1 className='App'>Go<i style={{color: "cornflowerblue"}}>BC</i></h1>
      <RenderMaps />
      <SearchOptions />
    </div>

  )
}
export default App;
