import { useState } from "react";
import '../components/styles/dropdown.scss';

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleDropdown} className={`menu-button ${isOpen ? "open" : ""}`}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </button>
      <div className={`dropdown ${isOpen ? "open" : ""}`}>
        <ul className="dropdown-menu">
          <li className="dropdown-item">Opción 1</li>
          <li className="dropdown-item">Opción 2</li>
          <li className="dropdown-item">Opción 3</li>
        </ul>
        <div className="dropdown-footer">Opción Final</div> 
      </div>
    </>
  );
}