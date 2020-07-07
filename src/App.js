import React from 'react';
import ShakerView from './app/ShakerView/ShakerView'
import ReactGA from 'react-ga';
import './App.scss';

function initializeReactGA() {
  ReactGA.initialize('UA-171702799-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

initializeReactGA()

const App = () => {
  return (
    <div className="App">
      <ShakerView />
    </div>
  );
}

export default App;
