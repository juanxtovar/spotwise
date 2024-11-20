import './styles/perfilUsuarioC.scss';
import LoadingSpinner from './loadingSpinner';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function Perfil() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const authId = user.id;

          const { data, error } = await supabase
            .from('usuarios') 
            .select('*')
            .eq('AuthId', authId)
            .single();

          if (error) throw error;

          setUserData(data);
        }
      } catch (error) {
        setError('Error al obtener el perfil del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="containerMain">
      {userData ? (
        <div className="container">
          <div className="info">
            <p><strong>Nombre:</strong> {userData.UsuaNombre}</p>
          </div>
          <div className="info">
            <p><strong>Apellido:</strong> {userData.UsuaApellido}</p>
          </div>
          <div className="info">
            <p><strong>Correo:</strong> {userData.UsuaCorreo}</p>
          </div>
          <div className="info">
            <p><strong>Teléfono:</strong> {userData.UsuaTelefono}</p>
          </div>
          <div className="info">
            <p><strong>Tipo de usuario:</strong> {userData.UsuaTipo}</p>
          </div>
        </div>
      ) : (
        <p>No se encontró el perfil del usuario.</p>
      )}
    </div>
  );
}
