import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Login from './pages/Login';
import Journey from './pages/Journey';
import SimulationLab from './pages/SimulationLab';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ProgressProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Journey />} />
            <Route path="/login" element={<Login />} />
            <Route path="/simulation-lab" element={<PrivateRoute><SimulationLab /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ProgressProvider>
  );
}

export default App;
