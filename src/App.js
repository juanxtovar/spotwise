import Container from './components/Conductor/container';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './screens/Conductor/login';
import Logup from './screens/Conductor/logup';
import ResetPassword from './screens/Conductor/resetPassword';
import ResetPassword2 from './screens/Conductor/resetPassword2';
import Vehiculos from './screens/Conductor/vehiculos';
import Elementos from './screens/Conductor/elementos';
import DashboardAdmin from './components/Administrador/dashboardAdmin';
import SalidaEntrada from './components/Administrador/salidaentrada';
import ReporteUsuarios from './screens/Conductor/reporteUsuarios';
import PerfilUsuario from './screens/Conductor/perfilUsuario';
import './App.css';
import Logo from'./assets/img/spotwiseBlanco.png';

function App() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogup = () => {
    navigate('/logup');
  };

  
  return (
    <Container>
      <div className="background">
        <div className='container-logo'>
          <img src={Logo} className='logo'></img>
        </div>
        <p className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque consectetur ad, dolorem quae tempore debitis autem fugit animi libero necessitatibus culpa. Veniam omnis, similique non tempora repudiandae laudantium necessitatibus ab!</p>
        <div className="button-container">
          <button onClick={handleLogin}>Iniciar Sesión</button>
          <button onClick={handleLogup}>Registrarse</button>
        </div>
      </div>
    </Container>
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
        <Route path="/dashboardAdmin" element={<DashboardAdmin/>}/>
        <Route path="/SalidaEntrada" element={<SalidaEntrada/>}/>
        <Route path="/reporteUsuarios" element={<ReporteUsuarios/>}/>
        <Route path="/perfilUsuario" element={<PerfilUsuario/>}/>
      </Routes>
    </Router>
  );
}

export default MainApp;
