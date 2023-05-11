import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NavMenu from './NavMenu';
import Player from './player';
import Generator from './Generator';
import reportWebVitals from './reportWebVitals';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Player />,
  },
  {
    path: '/sequencer',
    element: <Player />,
  },
  { 
    path: '/about',
    element: <h1>About</h1>
  },
  {
    path: 'generator',
    element: <Generator />
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="App">
      <header className="App-header">
        <NavMenu />

        <RouterProvider router={router}/>
      </header>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
