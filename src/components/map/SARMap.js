import React from 'react';
import PropTypes from 'prop-types';

import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { Group as LayerGroup } from 'ol/layer.js';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { ScaleLine, defaults as DefaultControls } from 'ol/control';
import SourceVector from 'ol/source/Vector';
import LayerVector from 'ol/layer/Vector';
import { Point, LineString } from 'ol/geom/';
import { Style, Icon, Fill, Stroke } from 'ol/style/';

import { distanceInKmBetweenCoordinates } from '../../functions/LocationFunctions';

import marker from '../../img/marker.png';

const MAX_SPEED = 80; // 100 km/h
const MAX_ACCURACY = 100; // 100m

export default class SARMap extends React.Component {
  static propTypes = {
    markers: PropTypes.array, //Array of arrays
    zoom: PropTypes.number,
    center: PropTypes.object
  }
  
  static defaultProps = {
    markers: [],
    zoom: 12,
    center: { lat: -36.852329, lng: 174.769116 }
  }

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      markerLayers: []
    };
  }

  createNewMap() {
    return new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://tiles-{a-d}.data-cdn.linz.govt.nz/services;key=877beb090a4e4fab8c6ea96aefab3526/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', //50767
          })
        }),
        new LayerGroup({
          name: 'layerGroup',
          layers: this.state.markerLayers
        }),
      ],
      target: 'map',
      view: new View({
        center: transform([174.7690, -36.8522], 'EPSG:4326', 'EPSG:3857'),
        zoom: this.props.zoom
      }),
      controls: DefaultControls({
        attributionOptions: {
          collapsible: false
        }
      }).extend([
        new ScaleLine()
      ])
    });
  }

  transformMarkers(markers) {
    var transformedMarkers = [];
    for (var i=0; i<markers.length; i++) {
      var current = markers[i];
      var temp = [];

      for (var j=0; j<current.length; j++) {
        var marker = current[j];
        temp.push(transform([marker.longitude, marker.latitude], 'EPSG:4326', 'EPSG:3857'))
      }

      transformedMarkers.push(temp);
    }
    return transformedMarkers;
  }
  
  //Takes transformed markers
  createMarkersFeature(markers) {
    var markerSource = this.state.markerSource;
    for (var i=0; i<markers.length; i++) {
      var point = markers[i];
      var iconFeature = new Feature({
        geometry: new Point(point),
        name: 'Marker ' + marker.id
      });
      markerSource.addFeature(iconFeature);
    }
    
    //create the style for the markers
    var iconStyle = new Style({
      image: new Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: marker
      }))
    });

    //Marker vector layer
    var markerLayer = new LayerVector({
      source: markerSource,
      style: iconStyle
    });

    return markerLayer;
  }

  //Takes transformed markers
  createLineFeature(markers) {
    var lineSource = this.state.lineSource;
    lineSource.clear();
    var featureLine = new Feature({
      geometry: new LineString(markers)
    });

    lineSource.addFeature(featureLine);
  }

  addMarkersLayer(markers) {
    var layerArray = [];
    var markerSource = new SourceVector({});
    for (var i=0; i<markers.length; i++) {
      var point = markers[i];
      var iconFeature = new Feature({
        geometry: new Point(point),
        name: 'Marker ' + point.id
      });
      markerSource.addFeature(iconFeature);
    }
    layerArray.push(new LayerVector({
      source: markerSource,
      style: new Style({
        image: new Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 1,
          src: marker
        }))
      })
    }));

    var lineSource = new SourceVector({});
    var featureLine = new Feature({
      geometry: new LineString(markers)
    });
    lineSource.addFeature(featureLine);
    layerArray.push(new LayerVector({
      source: lineSource,
      style: new Style({
        fill: new Fill({ color: '#00FF00', weight: 4 }),
        stroke: new Stroke({ color: '#00FF00', width: 2 })
      })
    }));

    this.state.markerLayers.push(...layerArray);
  }

  componentDidMount() {
    this.setState(() => {
      map: this.createNewMap();
    });

    var transformedMarkers = this.transformMarkers(this.props.markers);
    this.addMarkersLayer(transformedMarkers[0]);
    // this.createLineFeature(transformedMarkers[0]);
  }

  componentWillUpdate() {
    if (!this.props.filterPoints) {
      var transformedMarkers = this.transformMarkers(this.filterPoints(this.props.markers));
      this.updateMarkers(transformedMarkers);
      this.createLineFeature(transformedMarkers);
    } else {
      var transformedMarkers = this.transformMarkers(this.props.markers);
      this.updateMarkers(transformedMarkers);
      this.createLineFeature(transformedMarkers);
    }
  }

  updateMarkers(markers) {
    var markerSource = this.state.markerSource;
    markerSource.clear();
    for (var i=0; i<markers.length; i++) {
      var point = markers[i];
      var iconFeature = new Feature({
        geometry: new Point(point),
      });
      markerSource.addFeature(iconFeature);
    }
  }

  filterPoints(markers) {
    var filteredPoints = [];

    var prev = null;
    for (var i=0; i<markers.length; i++) {
      var current = markers[i];

      if (current.accuracy <= MAX_ACCURACY) {
        if (prev != null) {
          var distance = Math.abs(distanceInKmBetweenCoordinates(prev.latitude,prev.longitude, current.latitude, current.longitude));
          
          var currentTime = new Date(current.timestamp);
          var prevTime = new Date(prev.timestamp);

          var timeDifference = (currentTime - prevTime) / 3600000; //In hrs

          if (distance/timeDifference < MAX_SPEED) {
            filteredPoints.push(current);
          }
        }
      }

      prev = current;
    }

    return filteredPoints;
  }

  render() {
    // 64px is the height of the AppBar
    return (
      <section className="panel-map">
        <div id="map" className="map" ref="olmap" style={{height: 'calc(100vh - 64px)'}}></div> 
      </section>
    );
  }
}