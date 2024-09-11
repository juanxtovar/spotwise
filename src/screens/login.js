import Container from '../components/container';
import estacionamiento from '../assets/img/estacionamiento.jpg';
import './styles/login.scss';

export default function Login() {

  return (
    <Container>
        <div className="image-container">
          <img src={estacionamiento} alt="Estacionamiento" />
        </div>
        <div className="form-container">
          <form>
            <h1>Iniciar sesión</h1>
            <input
              type="text"
              name="username"
              placeholder="Ingresa tu correo electronico"
            />
            <input
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
            />
            <input type="submit" value="Ingresar" />
            <a href="#">¿Olvidaste tu contraseña?</a>
            <p>¿No tienes cuenta? <a href="#">Regístrate aquí</a></p>
          </form>
        </div>
    </Container>
  );
}
