import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AddVehicleModal from './addVehiculo';
import InfoVehiculo from './infoVehiculo'; 
import './styles/cardVehiculos.scss';
import PlaceholderImage from '../../assets/img/estacionamiento.jpg'; 

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function CardVehiculos() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); 
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); 

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          setError('Error al obtener el usuario autenticado.');
          setLoading(false);
          return;
        }

        if (!user) {
          setError('No hay usuario autenticado.');
          setLoading(false);
          return;
        }

        const { data: usuario, error: usuarioError } = await supabase
          .from('usuarios')
          .select('UsuaId')
          .eq('AuthId', user.id)
          .single();

        if (usuarioError || !usuario) {
          setError('No se encontró el usuario.');
          setLoading(false);
          return;
        }

        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehiculo')
          .select('*')
          .eq('UsuaId', usuario.UsuaId);

        if (vehiclesError) {
          setError('Error al obtener los vehículos.');
          setLoading(false);
          return;
        }

        setVehicles(vehicles);
        setLoading(false);
      } catch (err) {
        setError('Error inesperado al obtener los datos.');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (vehId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este vehículo?');
  
    if (!confirmDelete) {
      return;  
    }
  
    try {
      const { error } = await supabase
        .from('vehiculo')
        .delete()
        .eq('VehId', vehId);
  
      if (error) {
        setError('Error al eliminar el vehículo.');
        return;
      }
  
      setVehicles(vehicles.filter(vehicle => vehicle.VehId !== vehId));
    } catch (err) {
      setError('Error inesperado al eliminar el vehículo.');
    }
  };
  

  const handleAddVehicle = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInfoClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedVehicle(null);
  };

  if (loading) return <p className="loading-message">Cargando vehículos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const handleVehicleAdded = (newVehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
  };
  
  return (
    <div className='vehicle-main'>
      <div className="vehicle-header">
        <h2>Mis vehículos</h2>
        <p>({vehicles.length})</p>
      </div>
      <div className="vehicle-list">
        {vehicles.length > 0 ? (
          vehicles.map(vehicle => (
            <div className="vehicle-card" key={vehicle.VehId}>
              <div className="container-img">
                <img 
                  src={vehicle.VehImagen ? vehicle.VehImagen : PlaceholderImage} 
                  alt="Vehículo" 
                />
              </div>
              <div className="container-info">
                <button className="more-button" onClick={() => handleInfoClick(vehicle)}>+ Info</button>
                <p className="vehicle-placa">{vehicle.VehPlaca}</p>
              </div>
              <button className="delete-button" onClick={() => handleDelete(vehicle.VehId)}>Eliminar</button>
            </div>
          ))
        ) : (
          <p>No hay vehículos registrados.</p>
        )}
        <div className='container-add-button'>
          <button className="add-vehicle-button" onClick={handleAddVehicle}>Agregar Vehículo</button>
        </div>
        <AddVehicleModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onVehicleAdded={handleVehicleAdded} 
        />
        <InfoVehiculo 
          isOpen={isInfoModalOpen} 
          vehicle={selectedVehicle} 
          onClose={handleCloseInfoModal} 
        />
      </div>
    </div>
  );
}
