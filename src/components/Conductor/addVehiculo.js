import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles/addVehiculo.scss'; 

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AddVehiculo({ isOpen, onClose, onVehicleAdded }) {
  const [formData, setFormData] = useState({
    VehTipo: '',
    VehMarca: '',
    VehPlaca: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
  
      const sanitizedFileName = file.name.replace(/\s+/g, '-'); 
      const renamedFile = new File([file], sanitizedFileName, { type: file.type });
  
      setImage(renamedFile);
    }
  };

  const uploadImage = async (userId) => {
    if (!image) return null;
  
    const filePath = `${userId}/${image.name}`;   
  
    const { error: uploadError } = await supabase.storage
      .from('vehiculos')
      .upload(filePath, image, { upsert: true });
  
    if (uploadError) throw uploadError;
  
    const { data: { publicUrl }, error: publicUrlError } = supabase.storage
      .from('vehiculos')
      .getPublicUrl(filePath);
  
    if (publicUrlError) throw publicUrlError;
  
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('No se pudo obtener el usuario autenticado.');
        return;
      }

      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('UsuaId')
        .eq('AuthId', user.id)
        .single();

      if (usuarioError || !usuario) {
        alert('No se encontró el usuario.');
        return;
      }

      const imageUrl = await uploadImage(usuario.UsuaId);

      const { data: insertedVehicle, error: insertError } = await supabase
        .from('vehiculo')
        .insert([{
          UsuaId: usuario.UsuaId,
          VehTipo: formData.VehTipo,
          VehMarca: formData.VehMarca,
          VehPlaca: formData.VehPlaca,
          VehImagen: imageUrl,  
        }])
        .select('*')
        .single();

      if (insertError) {
        alert('Error al agregar el vehículo.');
        return;
      }

      alert('¡Vehículo agregado exitosamente!');
      setFormData({
        VehTipo: '',
        VehMarca: '',
        VehPlaca: '',
      });
      setImage(null);

      onVehicleAdded(insertedVehicle);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      alert('Error inesperado.');
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
            required
          />
          <input
            type="text"
            name="VehMarca"
            placeholder="Marca"
            value={formData.VehMarca}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="VehPlaca"
            placeholder="Placa"
            value={formData.VehPlaca}
            onChange={handleChange}
            required
          />
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
}
