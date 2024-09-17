import { useState } from "react";
import '../components/styles/dropdown.scss';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sIjoImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function DropdownMenu() {
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

  return (
    <>
      <button onClick={toggleDropdown} className={`menu-button ${isOpen ? "open" : ""}`}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </button>
      <div className={`dropdown ${isOpen ? "open" : ""}`}>
        <ul className="dropdown-menu">
          <li className="dropdown-item">Mis vehículos</li>
          <li className="dropdown-item">Elementos</li>
          <li className="dropdown-item">Reportes</li>
        </ul>
        <div className="dropdown-footer" onClick={handleLogout}>
          Cerrar sesión
        </div>
      </div>
    </>
  );
}
