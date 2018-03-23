import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromiseMiddleware from 'redux-promise-middleware'
import thunk from 'redux-thunk';
import {BrowserRouter} from 'react-router-dom';

import reducers from './redux';
import App from './app';

const jeffskiStore = createStore(reducers, applyMiddleware(reduxPromiseMiddleware(), thunk));

ReactDOM.render(
  <Provider store={jeffskiStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.querySelector('.reactContainer'));