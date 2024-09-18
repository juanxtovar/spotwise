import './styles/sedeAdmin.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Configura tu cliente de Supabase
const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function Sede() {
  const [selectedSede, setSelectedSede] = useState(null); // Ahora guardaremos tanto el SedId como el SedNombre
  const [sedes, setSedes] = useState([]);
  const navigate = useNavigate();

  const fetchSedes = async () => {
    const { data, error } = await supabase
      .from('sede')
      .select('SedId, SedNombre');

    if (error) {
      console.error('Error fetching sedes:', error);
    } else {
      console.log('Sedes obtenidas:', data);
      setSedes(data); // Guarda las sedes obtenidas
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  const handleSedeChange = (e) => {
    const sedeSeleccionada = sedes.find(sede => sede.SedId === parseInt(e.target.value));
    setSelectedSede(sedeSeleccionada); // Guarda tanto el ID como el nombre de la sede seleccionada
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSede) {
      alert('Por favor selecciona una sede');
    } else {
      alert(`Sede seleccionada: ${selectedSede.SedNombre}`);
      // Almacenar la sede seleccionada para usarla más adelante
      localStorage.setItem('selectedSede', JSON.stringify(selectedSede)); // Guarda la sede seleccionada en el almacenamiento local
      navigate('/salidaentrada'); // Redirige a la página de Salida/Entrada
    }
  };

  return (
    <main className="main-content">
      <div className="sede-section">
        <h1>Selecciona tu sede</h1>
        <p>Selecciona la sede en la que estás ubicado para continuar a la aplicación.</p>

        <form onSubmit={handleSubmit}>
          <select value={selectedSede?.SedId || ''} onChange={handleSedeChange}>
            <option value="">-- Selecciona una sede --</option>
            {sedes.map((sede) => (
              <option key={sede.SedId} value={sede.SedId}>
                {sede.SedNombre}
              </option>
            ))}
          </select>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </main>
  );
}
