import React from 'react';
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Movie from './components/Movie'
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import { setIsAdmin } from './global';

function App() {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    )
}

function AppContent() {
    const { token } = useAuth();
    useEffect(() => {
      setIsAdmin(!!token);
    }, [token]);
    return (
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/movie/:movie_id" element={<Movie />} />
          </Routes>
        </Router>
    );
}

export default App
