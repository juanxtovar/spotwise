import ContainerDashboard from "../../components/Conductor/containerDashboard";
import './styles/dashboard.scss';
import Header from "../../components/Conductor/header";
import Perfil from "../../components/Conductor/perfilUsuarioC";
import ImagenPerfil from "../../components/Conductor/imagenPerfil";

export default function PerfilUsuario() {
  return (
    <ContainerDashboard>
      <Header/>
      <ImagenPerfil/>
      <Perfil/>
    </ContainerDashboard>
  );
}
