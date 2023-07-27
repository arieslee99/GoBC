"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderGoogleMap = void 0;
require("./App.css");
var react_1 = require("react");
var api_1 = require("@react-google-maps/api");
function CurrentLocation() {
    var _a = (0, react_1.useState)(null), lat = _a[0], setLat = _a[1];
    var _b = (0, react_1.useState)(null), long = _b[0], setLong = _b[1];
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLat(Number(position.coords.latitude.toFixed(6)));
            setLong(Number(position.coords.longitude.toFixed(6)));
        });
    }
    else {
        console.log("geolocation not available");
    }
    return (<RenderGoogleMap lat={lat} long={long}/>);
}
function RenderGoogleMap(_a) {
    var lat = _a.lat, long = _a.long;
    var isLoaded = (0, api_1.useLoadScript)({
        googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    }).isLoaded;
    if (!isLoaded)
        return <div>loading</div>;
    return <Map latitude={lat} longitude={long}/>;
}
exports.RenderGoogleMap = RenderGoogleMap;
function Map(_a) {
    var latitude = _a.latitude, longitude = _a.longitude;
    var center = (0, react_1.useMemo)(function () { return ({
        lat: latitude, lng: longitude,
    }); }, [latitude, longitude]);
    return (<div>
      <api_1.GoogleMap zoom={18} center={center} mapContainerClassName="map-container">
      <api_1.MarkerF position={center}/>
    </api_1.GoogleMap>

    </div>);
}
function RenderMaps() {
    return (<CurrentLocation />);
}
exports.default = RenderMaps;
