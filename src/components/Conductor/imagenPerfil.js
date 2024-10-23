import './styles/imagenPerfil.scss';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FiPlus } from 'react-icons/fi';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function ImagenPerfil() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        if (!userId) {
          setError('Usuario no autenticado');
          return;
        }

        const { data, error } = await supabase
          .from('usuarios')
          .select('imagen_perfil')
          .eq('AuthId', userId)
          .single();

        if (error) {
          throw error;
        }

        setImageUrl(data.imagen_perfil);
      } catch (error) {
        setError('Error al cargar la imagen de perfil: ' + error.message);
      }
    };

    fetchImage();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      uploadImage(e.target.files[0]); 
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) {
      setError('Selecciona una imagen primero');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      if (!userId) {
        setError('Usuario no autenticado');
        return;
      }

      const filePath = `${userId}/${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('perfil')
        .upload(filePath, imageFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl }, error: publicUrlError } = supabase.storage
        .from('perfil')
        .getPublicUrl(filePath);

      if (publicUrlError) {
        throw publicUrlError;
      }

      setImageUrl(publicUrl); 

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ imagen_perfil: publicUrl })
        .eq('AuthId', userId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      setError('Error al subir la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="containerImage">
      <div className="profileImageWrapper" onClick={() => document.getElementById('fileInput').click()}>
        {imageUrl ? (
          <img src={imageUrl} alt="Imagen de Perfil" className="profileImage" />
        ) : (
          <div className="iconOverlay">
            <FiPlus />
          </div>
        )}
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleImageChange} 
          className="input"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {uploading && <p>Subiendo imagen...</p>}
    </div>
  );
}
