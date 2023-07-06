import './App.css';

function CurrentLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);
      })
    } else {
      console.log("geolocation not available"); 
    }
  }


export default Location;