import React from 'react';
import ShakerView from './app/ShakerView/ShakerView'
import ReactGA from 'react-ga';
import './App.scss';

const App = () => {
  ReactGA.initialize('UA-171702799-1');
  return (
    <div className="App">
      <ShakerView/>
    </div>
  );
}

export default App;
