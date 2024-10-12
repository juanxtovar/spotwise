import ContainerDashboard from "../../components/Conductor/containerDashboard";
import './styles/dashboard.scss';
import Header from "../../components/Conductor/header";
import CardElementos from "../../components/Conductor/cardElemento"

export default function Elementos() {
  return (
    <ContainerDashboard>
      <Header/>
      <CardElementos/>
    </ContainerDashboard>
  );
}
