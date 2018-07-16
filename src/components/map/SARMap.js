import React from 'react';
import { compose, withProps } from 'recompose';
import PropTypes from 'prop-types';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps"

export default class SARMap extends React.Component {
  static propTypes = {
    markers: PropTypes.array,
    zoom: PropTypes.number,
    center: PropTypes.object
  }
  
  static defaultProps = {
    markers: [],
    zoom: 16,
    center: { lat: -36.852329, lng: 174.769116 }
  }

  render() {
    var coordinates = []
    this.props.markers.forEach(element => {
      coordinates.push({ lat: element.latitude, lng: element.longitude });
    })

    const SARMap = compose(
      withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC0DPzLiu9R47vA0XWr-GOyCr2cx8JBDaU&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
        markers: this.props.markers
      }),
      withScriptjs,
      withGoogleMap
    )((props) =>
      <GoogleMap
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >

        {
          this.props.markers.map((marker => {
            console.log(marker.id);
            return <Marker 
              key={marker.id} 
              position={{ lat: marker.latitude, lng: marker.longitude }} />
          }))
        }

        <Polyline
          path={coordinates}
          geodesic={true}
          strokeColor={'#FF0000'}
          strokeOpacity={1.0}
          strokeWeight={2} />

      </GoogleMap>
    )

    return (
      <SARMap />
    );
  }
}