import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css'; // Make sure this exists

<<<<<<< HEAD
const root = document.getElementById('root');

if (!root) {
  throw new Error('Could not find root element with id "root". Make sure your index.html contains <div id="root"></div>');
}

ReactDOM.createRoot(root).render(<App />);
=======
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
>>>>>>> origin/master
