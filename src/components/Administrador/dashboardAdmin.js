import ContainerDashboard from "../containerDashboard";
import './styles/dashboardAdmin.scss';
import Header from "../header";
import Sede from "./SedeAdmin"

export default function DashboardAdmin() {
  return (
    <ContainerDashboard>
      <Header/>
      <Sede/>
    </ContainerDashboard>
  );
}
