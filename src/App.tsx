import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Movie from './components/Movie'

function App() {

    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:movie_id" element={<Movie />} />
        </Routes>
      </Router>
    )
}

export default App
