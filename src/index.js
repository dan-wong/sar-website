import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SARWelcome from './components/management/SARWelcome';
import registerServiceWorker from './registerServiceWorker';
import SARMap from './components/map/SARMap';
import ManageHome from './components/management/ManageHome';
import TopLevel from './TopLevel';
import DnDApp from './components/dragAndDrop/DragAndDropApp'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.render(
    <BrowserRouter>
        <TopLevel />
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();