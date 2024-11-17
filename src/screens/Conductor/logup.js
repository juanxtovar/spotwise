import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Container from "../../components/Conductor/container";
import estacionamiento from '../../assets/img/estacionamiento.jpg';
import logo from '../../assets/img/spotwiseVerde.png'
import './styles/login.scss';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function Logup() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, lastname, email, phone, password } = formData;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      alert('Error al registrar usuario: ' + signUpError.message);
      return;
    }

    if (!data || !data.user) {
      alert('No se recibió información del usuario');
      return;
    }

    const { error: profileError } = await supabase
      .from('usuarios')
      .insert([{
        UsuaNombre: name,
        UsuaApellido: lastname,
        UsuaCorreo: email,
        UsuaContraseña: password,
        UsuaTelefono: phone,
        AuthId: data.user.id,
      }]);

    if (profileError) {
      alert('Error al insertar perfil: ' + profileError.message);
    } else {
      alert('¡Registro exitoso!');
      setFormData({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: ''
      });
    }
  };

  return (
    <Container>
      <div className="image-container">
        <img src={estacionamiento} alt="Estacionamiento" />
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Registrarse</h1>
          <input
            type="text"
            name="name"
            placeholder="Ingresa tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Ingresa tu apellido"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Ingresa tu número de celular"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input type="submit" value="Registrarse" />
          <p>¿Ya tienes cuenta? <a href="/login">Inicia aquí</a></p>
        </form>
        <div className='logo-container'>
        <img src={logo} alt='Spotwise'/>
        </div>
      </div>
    </Container>
  );
}
