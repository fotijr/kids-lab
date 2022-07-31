import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Server from './pages/Server';
import Web from './pages/Web';
import Hardware from './pages/Hardware';
import Lab from './pages/Lab';
import './App.css';

function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="web" element={<Web />} />
        <Route path="server" element={<Server />} />
        <Route path="hardware" element={<Hardware />} />
        <Route path="lab" element={<Lab />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
