import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Container from '../../components/Conductor/container';
import estacionamiento from '../../assets/img/estacionamiento.jpg';
import logo from '../../assets/img/spotwiseVerde.png'
import './styles/login.scss';
import { useNavigate } from 'react-router-dom';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (signInError) {
      alert('Error al iniciar sesión: ' + signInError.message);
      return;
    }
  
    if (!data || !data.user) {
      alert('No se recibió información del usuario');
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('UsuaTipo')
      .eq('UsuaCorreo', email) 
      .single();
  
    if (userError) {
      alert('Error al obtener información del usuario: ' + userError.message);
      return;
    }
  
    if (userData.UsuaTipo === 'Conductor') {
      navigate('/vehiculos'); 
    } else if (userData.UsuaTipo === 'Administrador') {
      navigate("/dashboardAdmin"); 
    } else {
      alert('Tipo de usuario no reconocido');
    }
  
    alert('¡Inicio de sesión exitoso!');
  };
  
  return (
    <Container>
      <div className="image-container">
        <img src={estacionamiento} alt="Estacionamiento" />
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Iniciar sesión</h1>
          <input
            type="email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <input type="submit" value="Ingresar" />
          <a href="/resetPassword">¿Olvidaste tu contraseña?</a>
          <p>¿No tienes cuenta? <a href="/logup">Regístrate aquí</a></p>
        </form>
        <div className='logo-container'>
        <img src={logo} alt='Spotwise'/>
        </div>
      </div>
    </Container>
  );
}
