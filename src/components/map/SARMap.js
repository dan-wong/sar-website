import React from 'react';
import PropTypes from 'prop-types';

import { Map, View, LonLat } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transform } from 'ol/proj';
import { Attribution, ScaleLine, defaults as DefaultControls } from 'ol/control';
import OSM from 'ol/source/OSM';

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
    let map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new TileLayer({
          source: new XYZ({
            url: 'http://tiles-{a-d}.data-cdn.linz.govt.nz/services;key=877beb090a4e4fab8c6ea96aefab3526/tiles/v4/layer=50768/EPSG:3857/{z}/{x}/{y}.png', //50767
            attributions: [
              new Attribution({ html: '<a href="http://data.linz.govt.nz">LINZ. CC BY 4.0</a>' })
            ]
          })
        })
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
    return (
      <section className="panel-map">
        <div id="map" className="map" ref="olmap" style={{height: '100vh'}}></div>
      </section>
    );
  }
}