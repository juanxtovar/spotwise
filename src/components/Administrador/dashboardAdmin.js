import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/dashboardAdmin.scss';
import Header from "./header2";
import Sede from "./SedeAdmin"

export default function DashboardAdmin() {
  return (
    <ContainerDashboard>
      <Header/>
      <Sede/>
    </ContainerDashboard>
  );
}
