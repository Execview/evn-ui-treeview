import React from 'react';
import { createRoot } from 'react-dom/client'

import './index.css';
import * as serviceWorker from './serviceWorker.js';
import App from './App.js';


import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './store/reducer.js';

import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './store/epic.js'

import version from './version.js'
console.log(`Refreshed at: ${version.version}`)

const epicMiddleware = createEpicMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk, epicMiddleware)))

epicMiddleware.run(rootEpic)
createRoot(document.getElementById('root')).render(<Provider store={store}><App /></Provider>)
serviceWorker.unregister();