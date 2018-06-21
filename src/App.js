import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import API from './api';

class App extends Component {
  render() {
    const MyMapComponent = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC0DPzLiu9R47vA0XWr-GOyCr2cx8JBDaU&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: -36.852329, lng: 174.769116 }}
      >
        {props.isMarkerShown && <Marker position={{ lat: -36.852329, lng: 174.769116 }} />}
      </GoogleMap>
    )

    console.log(API.getSearchTrack(1, 1));

    return (
      <div>
        <MyMapComponent isMarkerShown />
      </div>
    );
  }
}

export default App;
