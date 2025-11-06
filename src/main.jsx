import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Could not find root element with id "root". Make sure your index.html contains <div id="root"></div>');
}

ReactDOM.createRoot(root).render(<App />);
