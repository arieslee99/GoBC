import './App.css';
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
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
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
      <h1 className='App'>Where would you like to go today?</h1>
      <form className='App'  onSubmit={handleSubmit}>
        <input id="bnum" type="text" value={input} placeholder="Bus Stop Number" onChange={handleChange} />
        <input type="submit" value="Check Schedule"/> 
      </form>
      <GetData busStop={updated}/>
    </div>


  )
}

export default App;
