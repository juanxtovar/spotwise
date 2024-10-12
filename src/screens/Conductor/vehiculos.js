import ContainerDashboard from "../../components/Conductor/containerDashboard";
import './styles/dashboard.scss';
import Header from "../../components/Conductor/header";
import CardVehiculos from "../../components/Conductor/cardVehiculos"

export default function Vehiculos() {
  return (
    <ContainerDashboard>
      <Header/>
      <CardVehiculos/>
    </ContainerDashboard>
  );
}
