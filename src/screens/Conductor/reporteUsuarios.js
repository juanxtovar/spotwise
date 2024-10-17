import ContainerDashboard from "../../components/Conductor/containerDashboard";
import './styles/dashboard.scss';
import Header from "../../components/Conductor/header";
import FormReporte from "../../components/Conductor/formReporte"

export default function ReporteUsuarios() {
  return (
    <ContainerDashboard>
      <Header/>
      <FormReporte/>
    </ContainerDashboard>
  );
}
