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
import { Style, Circle, Fill, Stroke } from 'ol/style/';

import { distanceInKmBetweenCoordinates } from '../../functions/LocationFunctions';
import { rainbow } from '../../functions/ColorGenerator';

const MAX_SPEED = 80; // 100 km/h
const MAX_ACCURACY = 100; // 100m
const VISIBILITY = 50;

const DEFAULT_LAYER = new TileLayer({
  source: new XYZ({
    url: 'http://tiles-{a-d}.data-cdn.linz.govt.nz/services;key=877beb090a4e4fab8c6ea96aefab3526/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', //50767
  })
});
var MARKER_LAYERS = [];

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
    };
  }

  createNewMap() {
    return new Map({
      layers: [
        DEFAULT_LAYER,
        new LayerGroup({
          name: 'layerGroup',
          layers: MARKER_LAYERS
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

  /**
   * When given an array of markers, it generates two layers 
   * 1 - Markers
   * 2 - Line segments connecting the markers
   * 
   * @param {Array} markers 
   */
  addMarkersLayer(markers, numOfSteps, step) {
    var layerArray = [];

    var lineSource = new SourceVector({});
    var featureLine = new Feature({
      geometry: new LineString(markers)
    });
    lineSource.addFeature(featureLine);

    var colorArray = rainbow(numOfSteps, step);
    var lineColor = 'rgba(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ',0.6)';
    layerArray.push(new LayerVector({
      source: lineSource,
      style: new Style({
        stroke: new Stroke({
          color: lineColor,
          width: this.state.map == null ? 2 : VISIBILITY / this.state.map.getView().getResolution()
        })
      })
    }));

    var markerSource = new SourceVector({});
    for (var i=0; i<markers.length; i++) {
      var point = markers[i];
      var iconFeature = new Feature({
        geometry: new Point(point),
        name: 'Marker ' + point.id
      });
      markerSource.addFeature(iconFeature);
    }

    colorArray = rainbow(numOfSteps, step+1);
    lineColor = 'rgba(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ',0.6)';

    layerArray.push(new LayerVector({
      id: 'markers',
      source: markerSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: lineColor
          }),
          opacity: 0.7
        })
      })
    }));
    
    return layerArray;
  }

  componentDidMount() {
    var transformedMarkers = this.transformMarkers(this.props.markers);
    for (var i=0; i<transformedMarkers.length; i++) {
      MARKER_LAYERS.push(...this.addMarkersLayer(transformedMarkers[i], transformedMarkers.length * 2, i*2));
    }
    this.setState({
      map: this.createNewMap()
    }, () => {
      /**
       * This block of code dynamically updates the stroke width of the line layers to be 50m wide
       */
      var currentComponent = this; 
      this.state.map.getView().on('propertychange', function(e) {
        switch (e.key) {
          case 'resolution':
            currentComponent.state.map.getLayers().forEach((layer) => {
              if (layer.type == 'VECTOR' && layer.values_.id != 'markers') {
                layer.style_.stroke_.width_ = VISIBILITY / e.oldValue;
              }
            });
            break;
        }
      });
    })
  }

  componentWillUpdate() {
    var transformedMarkers = [];
    if (!this.props.filterPoints) {
      transformedMarkers = this.transformMarkers(this.filterPoints(this.props.markers));
    } else {
      transformedMarkers = this.transformMarkers(this.props.markers);
    }

    if (this.state.map != null) {
      var layers = [];
      layers.push(DEFAULT_LAYER);
      for (var i=0; i<transformedMarkers.length; i++) {
        layers.push(...this.addMarkersLayer(transformedMarkers[i], transformedMarkers.length * 2, i*2));
      }
      var layerGroup = new LayerGroup({
        name: 'layerGroup',
        layers: layers
      });
      this.state.map.setLayerGroup(layerGroup);
    }
  }

  filterPoints(markers) {
    var filteredPoints = [];
    
    for (var i=0; i<markers.length; i++) {
      var currentListOfMarkers = markers[i];
      var temp = [];
      var prev = null;
      for (var j=0; j<currentListOfMarkers.length; j++) {
        var current = currentListOfMarkers[j];
  
        if (current.accuracy <= MAX_ACCURACY) {
          if (prev != null) {
            var distance = Math.abs(distanceInKmBetweenCoordinates(prev.latitude,prev.longitude, current.latitude, current.longitude));
            
            var currentTime = new Date(current.timestamp);
            var prevTime = new Date(prev.timestamp);
  
            var timeDifference = (currentTime - prevTime) / 3600000; //In hrs
  
            if (distance/timeDifference < MAX_SPEED) {
              temp.push(current);
            }
          }
        }
        prev = current;
      }
      filteredPoints.push(temp);
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