import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Verify from './pages/Verify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/discover" 
          element={
            <ProtectedRoute requireVerification={true}>
              <Discover />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute requireVerification={true}>
              <Chat />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/verify" 
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}