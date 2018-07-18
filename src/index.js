import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SARWelcome from './components/management/SARWelcome';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SARWelcome />, document.getElementById('root'));
registerServiceWorker();