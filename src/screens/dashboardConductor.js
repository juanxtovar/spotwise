import DropdownMenu from "../components/dropdownMenu";
import Container from "../components/container";
import './styles/dashboard.scss';
import SpotwiseBlanco from "../assets/img/spotwiseBlanco.png";
import UserProfile from "../components/userProfile"; // Importar el nuevo componente

export default function DashboardConductor() {
  return (
    <Container>
      <header className="dashboard-header">
        <div className="header-menu">
          <DropdownMenu />
        </div>
        <div className="header-logo">
          <img src={SpotwiseBlanco} alt="Logo Spotwise" />
        </div>
        <div className="header-user">
          <UserProfile /> {/* Muestra el nombre del usuario */}
        </div>
      </header>
      <div></div>
    </Container>
  );
}
