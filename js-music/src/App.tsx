import React from 'react';
import Player from './player';
import './App.css';
import NavMenu from './NavMenu';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <NavMenu />

          <Player />

      </header>
    </div>
  );
}

export default App;
