import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './screens/login';
import Logup from './screens/logup';
import ResetPassword from './screens/resetPassword';
import ResetPassword2 from './screens/resetPassword2';
import DashboardConductor from './screens/dashboardConductor';


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
      <h1>Hello, World!</h1>
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
        <Route path="/dashboardConductor" element={<DashboardConductor/>}/>


      </Routes>
    </Router>
  );
}

export default MainApp;
