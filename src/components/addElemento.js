import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles/addElementos.scss'

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AddElemento({ isOpen, onClose, setItems }) {
  const [serial, setSerial] = useState('');
  const [marca, setMarca] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError || !user) {
        setError('Error al obtener el usuario.');
        return;
      }
  
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('UsuaId')
        .eq('AuthId', user.id)
        .single();
  
      const { data, error: insertError } = await supabase
        .from('ingresoElementos')
        .insert([{ 
          InSerial: serial, 
          InMarca: marca,
          UsuaId: usuario.UsuaId
        }])
        .select(); 
  
      if (insertError) {
        setError('Error al agregar el elemento: ' + insertError.message);
      } else if (data && data.length > 0) {  
        setItems(prevItems => [...prevItems, data[0]]);
        onClose(); 
      } else {
        setError('No se devolvieron datos después de insertar el elemento.');
      }
    } catch (err) {
      setError('Error inesperado al agregar el elemento.');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className.includes('modal')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h3>Agregar Elemento</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Serial:
            <input 
              type="text" 
              value={serial} 
              onChange={(e) => setSerial(e.target.value)} 
              required 
            />
          </label>
          <label>
            Marca:
            <input 
              type="text" 
              value={marca} 
              onChange={(e) => setMarca(e.target.value)} 
              required 
            />
          </label>
          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
}
