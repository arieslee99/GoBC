import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from "react";


function GetData({busStop}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    setLoading(true);
    const BASE_URL = "https://api.translink.ca"
    const SEARCH_PATH = busStop;
    let FINAL_URL = `${BASE_URL}/rttiapi/v1/stops/${SEARCH_PATH}/estimates?apikey=MfbIeYyUTRdAUbp20RRP`;

    fetch(FINAL_URL, {headers}) 
    .then((response) => response.json())
    .then(setData)
    .then(() => {setLoading(false)})
    .catch(setError);
  }, [busStop]);
  
  if (loading) return <h1>Loading Data</h1>
  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data) return null;

  return (
   //<Bus busses={data.RouteNo}/>
   <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <Button
      type="button"
      style={{ backgroundColor: 'navyblue' }}
      onClick={decoratedOnClick}
    >
      {children}
    </Button>
  );
}

function Example() {
  return (
    <Accordion defaultActiveKey="0" style={{backgroundColor: "white"}}>
      <Card style={{border: "none"}}>
        <Card.Header style={{border: "none"}}>
          <CustomToggle eventKey="0">Bus Stop Number</CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            Bus stop information
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
      <h1 className='App'>Go<i style={{color: "cornflowerblue"}}>BC</i></h1>
      
      <Example />

    <form className='FormTraits' onSubmit={handleSubmit}>
        <input id="bnum" type="text" value={input} placeholder="Bus Stop Number" onChange={handleChange} />
        <input type="submit" value="Check Schedule"/> 
    </form>
      <GetData busStop={updated}/>
    </div>


  )
}

export default App;
