import ContainerDashboard from "../components/containerDashboard";
import './styles/dashboard.scss';
import Header from "../components/header";
import CardElementos from "../components/cardElemento"

export default function Elementos() {
  return (
    <ContainerDashboard>
      <Header/>
      <CardElementos/>
    </ContainerDashboard>
  );
}
