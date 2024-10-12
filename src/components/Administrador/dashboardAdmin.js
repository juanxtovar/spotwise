import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/dashboardAdmin.scss';
import Header from "../Conductor/header";
import Sede from "./SedeAdmin"

export default function DashboardAdmin() {
  return (
    <ContainerDashboard>
      <Header/>
      <Sede/>
    </ContainerDashboard>
  );
}
