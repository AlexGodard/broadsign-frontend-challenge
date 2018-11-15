import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

['REACT_APP_UNSPLASH_ACCESS_KEY'].forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error('The ' + envVar + " environnement variable must be set to start the app.");
  }
});


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
