import Perfil from "../../components/Conductor/perfilUsuarioC";
import ImagenPerfil from "../../components/Conductor/imagenPerfil";
import './styles/perfil.scss'

export default function Perfil2() {
  return (
    <div className="container-main">
        <h1>Perfil de Usuario</h1>
        <div className="container-perfil">
            <ImagenPerfil/>
            <Perfil/>
        </div>
    </div>
  );
}
