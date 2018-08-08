import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SARWelcome from './components/management/SARWelcome';
import registerServiceWorker from './registerServiceWorker';
import SARMap from './components/map/SARMap';
import ManageHome from './components/management/ManageHome';

ReactDOM.render(<ManageHome  />, document.getElementById('root'));
registerServiceWorker();