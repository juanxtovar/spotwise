import Container from "../../components/Conductor/container"
import estacionamiento from '../../assets/img/estacionamiento.jpg'
import  './styles/login.scss'

export default function ResetPassword2() {

    return(
        <Container>
        <div className="image-container">
          <img src={estacionamiento} alt="Estacionamiento" />
        </div>
        <div className="form-container">
          <form>
            <h1 className="title-resetPassword">Recupera tu contraseña</h1>
            <p className="text-resetPassword">Ingrese el codigo que recibio a su correo electronico e ingrese la nueva contraseña</p>
            <input type="text" name="code" placeholder="Ingrese el codigo"/>
            <input type="password" name="password"  placeholder="Ingrese la nueva contraseña" />
            <input type="password" name="password2"  placeholder="Confirme la nueva contraseña" />
            <input type="submit" value="Enviar codigo" />
            <a href="/login">Volver</a>
          </form>
        </div>
    </Container>
    ) 

}