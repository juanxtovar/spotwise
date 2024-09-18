import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './screens/login';
import Logup from './screens/logup';
import ResetPassword from './screens/resetPassword';
import ResetPassword2 from './screens/resetPassword2';
import Vehiculos from './screens/vehiculos';
import Elementos from './screens/elementos';


function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogup = () => {
    navigate('/logup');
  };

  
  return (
    <div>
      <h1>Spotwise</h1>
      <button onClick={handleLogin}>Ir a Login</button>
      <button onClick={handleLogup}>Ir a Logup</button>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logup" element={<Logup />} />
        <Route path="/resetPassword" element={<ResetPassword/>}/>
        <Route path="/resetPassword2" element={<ResetPassword2/>}/>
        <Route path="/vehiculos" element={<Vehiculos/>}/>
        <Route path="/elementos" element={<Elementos/>}/>

      </Routes>
    </Router>
  );
}

export default MainApp;
