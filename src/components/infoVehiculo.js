import React from 'react';
import './styles/infoVehiculo.scss';

export default function InfoVehiculo({ isOpen, vehicle, onClose }) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="vehicle-info-modal"  onClick={onClose}>
      <div className="modal-content">
        <h3>Información del Vehículo</h3>
        <p><strong>Placa:</strong> {vehicle.VehPlaca}</p>
        <p><strong>Marca:</strong> {vehicle.VehMarca}</p>
        <button onClick={onClose} className="close-button">Cerrar</button>
      </div>
    </div>
  );
}
