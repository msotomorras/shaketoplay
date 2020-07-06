import React, { useEffect } from 'react';
import ShakerView from './app/ShakerView/ShakerView'
import ReactGA from 'react-ga';
import './App.scss';

function initializeReactGA() {
  ReactGA.initialize('UA-171702799-1');
  ReactGA.pageview('/');
}

const App = () => {
  useEffect(() => {
    initializeReactGA()
  }, [])
  return (
    <div className="App">
      <ShakerView/>
    </div>
  );
}

export default App;
