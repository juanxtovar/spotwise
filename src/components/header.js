import SpotwiseBlanco from "../assets/img/spotwiseBlanco.png";
import UserProfile from "./userProfile"
import DropdownMenu from "./dropdownMenu";
import "./styles/header.scss"

export default function Header() {
    return(
        <header className="dashboard-header">
            <div className="header-menu">
                <DropdownMenu />
            </div>
            <div className="header-logo">
                <img src={SpotwiseBlanco} alt="Logo Spotwise" />
            </div>
            <div className="header-user">
                <UserProfile />
            </div>
        </header>
    )
}