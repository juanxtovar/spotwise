import ContainerDashboard from "../../components/Conductor/containerDashboard";
import './styles/dashboard.scss';
import Header from "../../components/Conductor/header";
import Perfil from "../../components/Conductor/perfil";

export default function PerfilUsuario() {
  return (
    <ContainerDashboard>
      <Header/>
      <Perfil/>
    </ContainerDashboard>
  );
}
