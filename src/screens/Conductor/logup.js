import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Container from "../../components/Conductor/container"
import estacionamiento from '../../assets/img/estacionamiento.jpg'
import './styles/login.scss'

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE')

export default function Logup() {
    const [formData, setFormData] = useState({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: ''
    })
  
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      const { name, lastname, email, phone, password } = formData
  
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
  
      if (signUpError) {
        setErrorMessage('Error al registrar usuario: ' + signUpError.message)
        return
      }
  
      if (!data || !data.user) {
        setErrorMessage('No se recibió información del usuario')
        return
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
        }])
  
      if (profileError) {
        setErrorMessage('Error al insertar perfil: ' + profileError.message)
      } else {
        setSuccessMessage('¡Registro exitoso!')
        setErrorMessage('')
        
        setFormData({
          name: '',
          lastname: '',
          email: '',
          phone: '',
          password: ''
        })
      }
    }
  
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
            />
            <input 
              type="text" 
              name="lastname" 
              placeholder="Ingresa tu apellido" 
              value={formData.lastname} 
              onChange={handleChange} 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Ingresa tu correo electronico" 
              value={formData.email} 
              onChange={handleChange} 
            />
            <input 
              type="text" 
              name="phone" 
              placeholder="Ingresa tu número de celular" 
              value={formData.phone} 
              onChange={handleChange} 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Ingresa tu contraseña" 
              value={formData.password} 
              onChange={handleChange} 
            />
            <input type="submit" value="Registrarse" />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <p>¿Ya tienes cuenta? <a href="/login">Inicia aquí</a></p>
          </form>
        </div>
      </Container>
    )
  }