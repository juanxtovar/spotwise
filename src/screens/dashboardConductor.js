import ContainerDashboard from "../components/containerDashboard";
import './styles/dashboard.scss';
import Header from "../components/header";
import CardVehiculos from "../components/cardVehiculos"

export default function DashboardConductor() {
  return (
    <ContainerDashboard>
      <Header/>
      <CardVehiculos/>
    </ContainerDashboard>
  );
}
