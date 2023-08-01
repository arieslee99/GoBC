import "./App.css";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

export function RenderGoogleMap(spot: google.maps.LatLngLiteral) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>loading</div>;

  return <Map lat={spot.lat} lng={spot.lng} />;
}

function Map(latlong: google.maps.LatLngLiteral) {
  return (
    <div>
      <GoogleMap
        zoom={18}
        center={latlong}
        mapContainerClassName="map-container"
      >
        <MarkerF position={latlong} />
      </GoogleMap>
    </div>
  );
}

export default RenderGoogleMap;
