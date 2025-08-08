import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Pages
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import Analytics from './pages/Analytics';
import Templates from './pages/Templates';
import Trends from './pages/Trends';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import Demo from './pages/demo/Demo';
import Integrations from './pages/Integrations';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Navbar />
              <div className="page-content">
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/generator" element={<ContentGenerator />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/trends" element={<Trends />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 