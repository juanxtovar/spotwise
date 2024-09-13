import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Container from '../components/container';
import estacionamiento from '../assets/img/estacionamiento.jpg';
import './styles/login.scss';
import { useNavigate } from 'react-router-dom';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate =useNavigate();

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
      setErrorMessage('Error al iniciar sesión: ' + signInError.message);
      return;
    }

    if (!data || !data.user) {
      setErrorMessage('No se recibió información del usuario');
      return;
    }

    setSuccessMessage('¡Inicio de sesión exitoso!');
    setErrorMessage('');
    navigate('/dashboardConductor'); 

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
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <a href="/resetPassword">¿Olvidaste tu contraseña?</a>
          <p>¿No tienes cuenta? <a href="/logup">Regístrate aquí</a></p>
        </form>
      </div>
    </Container>
  );
}
