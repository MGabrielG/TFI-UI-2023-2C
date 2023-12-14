import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Game from './components/Game'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* <Route path="*" element={<Error404 />} /> */}
        {/* <Route path="/" element={<MainMenu />} /> */}
        <Route path="/" element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App
