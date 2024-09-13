import Container from "../components/container"
import estacionamiento from '../assets/img/estacionamiento.jpg'
import  './styles/login.scss'

export default function ResetPassword() {

    return(
        <Container>
        <div className="image-container">
          <img src={estacionamiento} alt="Estacionamiento" />
        </div>
        <div className="form-container">
          <form>
            <h1 className="title-resetPassword">Recupera tu contraseña</h1>
            <p className="text-resetPassword">Ingresa el correo electronico asociado a tu cuenta y recibiras un codigo para restablecer tu contraseña</p>
            <input type="email" name="email" placeholder="Ingresa tu correo electronico"/>
            <input type="submit" value="Enviar codigo" />
            <a href="/login">Volver</a>
          </form>
        </div>
    </Container>
    ) 

}