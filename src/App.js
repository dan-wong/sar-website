import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import API from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    }
  }

  componentDidMount() {
    let currentComponent = this;
    API.getSearchTrack(1,1).then(function(response) {
      const events = JSON.parse(response);
      var markersList = [];

      for (var i=0; i<events.events.length; i++) {
        markersList.push(events.events[i]);
      }

      currentComponent.setState({
        markers: markersList,
      });
    })
  }

  render() {
    if (this.state.markers && this.state.markers.length > 0) {
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

        {
          props.markers.map((marker => {
            return <Marker position={{ lat: marker.lat, lng: marker.lng}} key={marker.id} />
          }))
        }

        </GoogleMap>
      )

      return (
        <div>
          <MyMapComponent markers={this.state.markers}/>
        </div>
      );
    } else {
      return (<h1>Loading...</h1>)
    }
  }
}

export default App;
