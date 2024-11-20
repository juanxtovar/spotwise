import { useState } from "react";
import '../Conductor/styles/dropdown.scss';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaClipboardList, FaShapes } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sIjoImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function DropdownMenu2() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      navigate('/login');
    }
  };

  const handleAutorizacionVeh = () => {
    navigate('/validacion');
  };

  const handleAutorizacionElem = () => {
    navigate('/validacionusuarios');
  };

  const handlePlanilla = () => {
    navigate('/salidaentrada');
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
          <li className="dropdown-item" onClick={handleAutorizacionVeh}><FaCar size={25} style={{marginRight:"10px"}}/>Autorizacion Vehiculos</li>
          <li className="dropdown-item" onClick={handleAutorizacionElem}><FaShapes size={25} style={{marginRight:"10px"}}/>Autorizacion Elementos</li>
          <li className="dropdown-item" onClick={handlePlanilla}><FaClipboardList size={27} style={{marginRight:"10px"}}/>Planilla</li>
        </ul>
        <div className="dropdown-footer" onClick={handleLogout}><FaSignOutAlt size={25} style={{marginRight:"10px"}}/>
          Cerrar sesión
        </div>
      </div>
    </>
  );
}
