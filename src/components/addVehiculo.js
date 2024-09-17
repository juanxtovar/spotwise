import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles/addVehiculo.scss'; 

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AddVehiculo({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    VehTipo: '',
    VehMarca: '',
    VehPlaca: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setErrorMessage('No se pudo obtener el usuario autenticado.');
        return;
      }

      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('UsuaId')
        .eq('AuthId', user.id)
        .single();

      if (usuarioError || !usuario) {
        setErrorMessage('No se encontró el usuario.');
        return;
      }

      const { error: insertError } = await supabase
        .from('vehiculo')
        .insert([
          {
            UsuaId: usuario.UsuaId,
            VehTipo: formData.VehTipo,
            VehMarca: formData.VehMarca,
            VehPlaca: formData.VehPlaca,
          }
        ]);

      if (insertError) {
        setErrorMessage('Error al agregar el vehículo.');
        return;
      }

      setSuccessMessage('¡Vehículo agregado exitosamente!');
      setFormData({
        VehTipo: '',
        VehMarca: '',
        VehPlaca: '',
      });

      setTimeout(() => {
        setSuccessMessage('');
        onClose(); 
      }, 2000);
    } catch (err) {
      setErrorMessage('Error inesperado.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Agregar Vehículo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="VehTipo"
            placeholder="Tipo de vehículo"
            value={formData.VehTipo}
            onChange={handleChange}
          />
          <input
            type="text"
            name="VehMarca"
            placeholder="Marca"
            value={formData.VehMarca}
            onChange={handleChange}
          />
          <input
            type="text"
            name="VehPlaca"
            placeholder="Placa"
            value={formData.VehPlaca}
            onChange={handleChange}
          />
          <button type="submit">Agregar</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}
