import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import About from './pages/About';
import Visualizer from './pages/Visualizer';
import Fretboard from './pages/Fretboard';
// import Home from './pages/Home';
// import Tuner from './pages/Tuner';

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/tuner" element={<></>} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/about" element={<About />} />
            <Route path="/fretboard" element={<Fretboard />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;