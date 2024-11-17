import Container from "../../components/Conductor/container"
import estacionamiento from '../../assets/img/estacionamiento.jpg'
import logo from '../../assets/img/spotwiseVerde.png'
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
          <div className='logo-container'>
            <img src={logo} alt='Spotwise'/>
          </div>
        </div>
    </Container>
    ) 

}