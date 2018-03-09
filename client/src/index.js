import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './redux';
import promiseMiddleware from 'redux-promise';
import reduxPromiseMiddleware from 'redux-promise-middleware'
import App from './app';

const createStoreWithMiddleware = applyMiddleware(reduxPromiseMiddleware())(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
      <App />
  </Provider>
  , document.querySelector('.reactContainer'));