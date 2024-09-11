
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './screens/login';

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/Login');
  };

  return (
    <div>
      <h1>Hello, World!</h1>
      <button onClick={handleLogin}>Ir</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
