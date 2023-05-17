import React from 'react';
import ReactDOM from 'react-dom/client';
import './bootstrap';
import Main from './components/Main';


if (document.getElementById('app')) {
  const Index = ReactDOM.createRoot(document.getElementById("app"));

  Index.render(
      <React.StrictMode>
          <Main/>
      </React.StrictMode>
  )
}
