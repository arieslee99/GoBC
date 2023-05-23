import './App.css';
import { useState, useEffect } from "react";

function Schedule({routeName, direction, destination}) {
  return (
    <div>
      <h1>{routeName}</h1>
      <p>{direction} : {destination}</p>
    </div>
  )
}

function UserInput() {
  return (
    <div>
      <h1>Where would you like to go today?</h1>
      <input id="bnum" type="text" placeholder="Bus Stop Number (e.g #58624)"></input>
      <input id= "bname" type="text" placeholder="Route Number(e.g 403)"></input>
      <button onClick={() => {
        GetData();
        return false;
      }}>Check Schedule</button>
    </div>
  )
}

function GetData() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch('https://api.translink.ca/rttiapi/v1/stops/58624/estimates?apikey=MfbIeYyUTRdAUbp20RRP', {headers})
    .then((response) => response.json())
    .then(setData)
    .then(() => {setLoading(false)})
    .catch(setError);
  }, []);
  
  if (loading) return <h1>Loading Data</h1>
  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data) return null;

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}

function App() {
  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   fetch('https://api.translink.ca/rttiapi/v1/stops/58624/estimates?apikey=MfbIeYyUTRdAUbp20RRP', {headers})
  //   .then((response) => response.json())
  //   .then(setData)
  //   .then(() => {setLoading(false)})
  //   .catch(setError);
  // }, []);
  
  // if (loading) return <h1>Loading Data</h1>
  // if (error) return <pre>{JSON.stringify(error)}</pre>
  // if (!data) return null;

  return (
    <UserInput />
  )
}

export default App;
