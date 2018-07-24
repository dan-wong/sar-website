import React from 'react';
import PropTypes from 'prop-types';

import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { ScaleLine, defaults as DefaultControls } from 'ol/control';
import SourceVector from 'ol/source/Vector';
import LayerVector from 'ol/layer/Vector';
import { Point, LineString } from 'ol/geom/';
import { Style, Icon, Fill, Stroke } from 'ol/style/';

import marker from '../../img/marker.png';

export default class SARMap extends React.Component {
  static propTypes = {
    markers: PropTypes.array,
    zoom: PropTypes.number,
    center: PropTypes.object
  }
  
  static defaultProps = {
    markers: [],
    zoom: 12,
    center: { lat: -36.852329, lng: 174.769116 }
  }

  componentDidMount() {
    var vectorSource = new SourceVector({
      //empty vector
    });
    
    var transformedPoints = [];
    for (var i=0; i<this.props.markers.length; i++) {
      const marker = this.props.markers[i];

      const point = transform([marker.longitude, marker.latitude], 'EPSG:4326', 'EPSG:3857');

      transformedPoints.push(point); //For the line

      var iconFeature = new Feature({
        geometry: new Point(point),
        name: 'Marker ' + marker.id
      });
  
      vectorSource.addFeature(iconFeature);
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
      source: vectorSource,
      style: iconStyle
    });
    
    //Line
    var featureLine = new Feature({
      geometry: new LineString(transformedPoints)
    });

    var vectorLine = new SourceVector({});
    vectorLine.addFeature(featureLine);

    //Line vector layer
    var lineLayer = new LayerVector({
      source: vectorLine,
      style: new Style({
        fill: new Fill({ color: '#00FF00', weight: 4 }),
        stroke: new Stroke({ color: '#00FF00', width: 2 })
      })
    })

    let map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://tiles-{a-d}.data-cdn.linz.govt.nz/services;key=877beb090a4e4fab8c6ea96aefab3526/tiles/v4/layer=50767/EPSG:3857/{z}/{x}/{y}.png', //50767
          })
        }),
        markerLayer,
        lineLayer
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

  render() {
    // 64px is the height of the AppBar
    return (
      <section className="panel-map">
        <div id="map" className="map" ref="olmap" style={{height: 'calc(100vh - 64px)'}}></div> 
      </section>
    );
  }
}