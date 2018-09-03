import React from 'react';
import PropTypes from 'prop-types';

import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Group as LayerGroup } from 'ol/layer';
// import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { ScaleLine, defaults as DefaultControls } from 'ol/control';
import SourceVector from 'ol/source/Vector';
import LayerVector from 'ol/layer/Vector';
import { Point, LineString } from 'ol/geom/';
import { Style, Circle, Fill, Stroke } from 'ol/style/';
import Overlay from 'ol/Overlay';

import { distanceInKmBetweenCoordinates } from '../../functions/LocationFunctions';
import { rainbow } from '../../functions/ColorGenerator';

import styles from './SARMap.css';

/**
 * This layer is the topographic layer provided by LINZ
 */
// const DEFAULT_LAYER = new TileLayer({
//   source: new XYZ({
//     url: 'http://tiles-{a-d}.data-cdn.linz.govt.nz/services;key=877beb090a4e4fab8c6ea96aefab3526/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', //50767
//   })
// });
const DEFAULT_LAYER = new TileLayer({
  source: new OSM()
});


/**
 * This holds the vector layers displayed ontop of the topographic map layer
 */
var MARKER_LAYERS = [];

export default class SARMap extends React.Component {
  static propTypes = {
    markers: PropTypes.array, //Array of arrays
    zoom: PropTypes.number,
    center: PropTypes.object,
    maxaccuracy: PropTypes.number,
    maxspeed: PropTypes.number,
    visibility: PropTypes.number,
    sliderValue: PropTypes.number
  }
  
  static defaultProps = {
    markers: [],
    zoom: 14,
    center: { lat: -36.852329, lng: 174.769116 },
    maxaccuracy: 50,
    maxspeed: 10,
    visibility: 20,
    sliderValue: 100
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
        ...MARKER_LAYERS //Place all the layers in the list into the map (... notation)
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

  /**
   * Transform markers in {lat, lng, timestamp} into {lng, lat} format of openmaps
   * @param {Array} markers 
   */
  transformMarkers(markers) {
    var transformedMarkers = [];
    for (var i=0; i<markers.length; i++) {
      var current = markers[i];
      var temp = [];

      for (var j=0; j<current.length; j++) {
        var marker = current[j];

        var transformedMarker = transform([marker.longitude, marker.latitude], 'EPSG:4326', 'EPSG:3857');
        marker.transformedLatitude = transformedMarker[1];
        marker.transformedLongitude = transformedMarker[0];

        temp.push(marker);
      }
      transformedMarkers.push(temp);
    }
    return transformedMarkers;
  }

  transformMarkersWithoutDetail(markers) {
    var transformedMarkers = [];
    for (var j=0; j<markers.length; j++) {
      var marker = markers[j];

      transformedMarkers.push(transform([marker.longitude, marker.latitude], 'EPSG:4326', 'EPSG:3857'));
    }
    return transformedMarkers;
  }

  /**
   * When given an array of markers, it generates two layers 
   * 1 - Line segments connecting the markers
   * 2 - Markers
   * 
   * It is in this order so that the markers are ONTOP of the line
   * 
   * @param {Array} markers 
   */
  addMarkersLayer(markers, numOfSteps, step) {
    var layerArray = [];

    var lineSource = new SourceVector({});
    var featureLine = new Feature({
      geometry: new LineString(this.transformMarkersWithoutDetail(markers))
    });
    lineSource.addFeature(featureLine);

    var colorArray = rainbow(numOfSteps, step);
    var lineColor = 'rgba(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ', 0.6)'; //Generate a random color with opacity 0.6
    // Visibility Line
    layerArray.push(new LayerVector({
      source: lineSource,
      style: new Style({
        stroke: new Stroke({
          color: lineColor,
          width: this.state.map == null ? 2 : this.props.visibility / this.state.map.getView().getResolution() //Use the scale to calculate the width of 50m
        })
      })
    }));

    var markerSource = new SourceVector({});
    for (var i=0; i<markers.length; i++) {
      var point = [markers[i].transformedLongitude, markers[i].transformedLatitude];

      var iconFeature = new Feature({
        geometry: new Point(point),
        name: '<p><b>Marker ID ' + markers[i].id + '</b><br />' +
          'Group ID: ' + markers[i].groupId + '<br />' +
          'Person ID: ' + markers[i].personId + '<br />' +
          'Timestamp: ' + markers[i].timestamp +  '<br />' +
          'Location: ' + markers[i].latitude + ', ' + markers[i].longitude + '<br />' +
          'Accuracy: ' + markers[i].accuracy + 'm' +
          '</p>'
      });

      markerSource.addFeature(iconFeature);
    }

    colorArray = rainbow(numOfSteps, step+1);
    var markerColor = 'rgba(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ', 0.75)'; //Generate a random color with opacity 0.75

    // Marker Line
    layerArray.push(new LayerVector({
      id: 'marker-line',
      source: lineSource,
      style: new Style({
        stroke: new Stroke({
          color: markerColor,
          width: 3
        })
      })
    }));

    // Markers
    layerArray.push(new LayerVector({
      id: 'markers',
      source: markerSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: markerColor
          }),
          opacity: 0.7
        })
      })
    }));
    
    return layerArray;
  }

  componentDidMount() {
    // var { markers } = this.props;
    // var eventFilteredMarkers = this.filterNumberOfEvents(markers, this.calculateNumberOfEventsFromSlider(markers));
    // var transformedMarkers = this.transformMarkers(this.filterPoints(eventFilteredMarkers));
    // console.log(transformedMarkers);
    // for (var i=0; i<transformedMarkers.length; i++) {
    //   MARKER_LAYERS.push(...this.addMarkersLayer(transformedMarkers[i], transformedMarkers.length * 2, i*2)); //For each array of markers, create their own markers and line layer
    // }

    var map = this.createNewMap();

    /**
     * This block of code dynamically updates the stroke width of the line layers to be 50m wide
     */
    var currentComponent = this;
    map.getView().on('propertychange', function(e) {
      switch (e.key) {
        case 'resolution':
          map.getLayers().forEach((layer) => {
            if (layer.type === 'VECTOR' && layer.values_.id !== 'markers' && layer.values_.id !== 'marker-line') { //Check if its the topographic layer or if its the markers layer
              layer.style_.stroke_.width_ = currentComponent.props.visibility / e.oldValue;
            }
          });
          break;
      }
    });

    /** Popup Code */
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    map.addOverlay(overlay);

    /** End Popup Code */

    map.on('click', function(evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
      });

      if (feature && feature.values_.geometry.flatCoordinates.length === 2) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();


        content.innerHTML = feature.values_.name;
        overlay.setPosition(coord);
      }
    });

    this.setState({
      map: map
    });
  }

  calculateNumberOfEventsFromSlider(markers) {
    var { sliderValue } = this.props;
    var totalNumberOfEvents = 0;
    for (var i=0; i<markers.length; i++) {
      totalNumberOfEvents += markers[i].length;
    }
    return Math.ceil(totalNumberOfEvents/100*sliderValue);
  }

  filterNumberOfEvents(markers, eventLimit) {
    var filteredPoints = [];
    var count = 0;
    
    for (var i=0; i<markers.length; i++) {
      var currentListOfMarkers = markers[i];
      var temp = [];
      for (var j=0; j<currentListOfMarkers.length; j++) {
        var current = currentListOfMarkers[j];
        if (count <= eventLimit) {
          temp.push(current);
          count++;
        }
      }
      filteredPoints.push(temp);
    }

    return filteredPoints;
  }

  /**
   * Filter points that do not meet the accuracy and speed criteria
   * @param {Array} markers 
   */
  filterPoints(markers) {
    var filteredPoints = [];
    
    for (var i=0; i<markers.length; i++) {
      var currentListOfMarkers = markers[i];
      var temp = [];
      var prev = null;
      for (var j=0; j<currentListOfMarkers.length; j++) {
        var current = currentListOfMarkers[j];
  
        if (current.accuracy <= this.props.maxaccuracy) {
          if (prev != null) {
            var distance = Math.abs(distanceInKmBetweenCoordinates(prev.latitude, prev.longitude, current.latitude, current.longitude));
            
            var currentTime = new Date(current.timestamp);
            var prevTime = new Date(prev.timestamp);
  
            var timeDifference = (currentTime - prevTime) / 3600000; //In hrs
  
            if (distance/timeDifference < this.props.maxspeed) {
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
    var { markers } = this.props;
    var eventFilteredMarkers = this.filterNumberOfEvents(markers, this.calculateNumberOfEventsFromSlider(markers));
    var transformedMarkers = this.transformMarkers(this.filterPoints(eventFilteredMarkers));

    /**
     * Remove all the layers from the map, then add the new filtered layers ontop
     */
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

    // 64px is the height of the AppBar
    return (
      <section className="panel-map">
        <div id="map" className="map" ref="olmap" style={{height: 'calc(100vh - 64px)'}}>
          <div id="popup" className={styles.olpopup}>
            <a href="#" id="popup-closer" className={styles.olpopupcloser}></a>
            <div id="popup-content"></div>
          </div>
        </div> 
      </section>
    );
  }
}