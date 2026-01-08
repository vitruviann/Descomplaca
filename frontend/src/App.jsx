import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import SolicitationFlow from './pages/SolicitationFlow';
import ChatFlow from './pages/ChatFlow';
import ClientOrder from './pages/ClientOrder';
import DispatcherDashboard from './pages/DispatcherDashboard';
import ClientDashboard from './pages/ClientDashboard';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/solicitar" element={<SolicitationFlow />} />
        <Route path="/pedido/:id" element={<ClientOrder />} />
        <Route path="/despachante" element={<DispatcherDashboard />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/chat" element={<ChatFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
