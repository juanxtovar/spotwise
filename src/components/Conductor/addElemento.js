import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles/addElementos.scss'

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AddElemento({ isOpen, onClose, setItems }) {
  const [serial, setSerial] = useState('');
  const [marca, setMarca] = useState('');
  const [tipoId, setTipoId] = useState('');  
  const [elementoId, setElementoId] = useState('');  
  const [tipos, setTipos] = useState([]);  
  const [elementos, setElementos] = useState([]);  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipos = async () => {
      const { data: tiposData, error: tiposError } = await supabase
        .from('tipo')
        .select('*');
  
      if (tiposError) {
        setError('Error al obtener los tipos: ' + tiposError.message);
      } else {
        setTipos(tiposData);
      }
    };  
  
    fetchTipos();
  }, []);

  const fetchElementos = async (tipoId) => {
    const { data: elementosData, error: elementosError } = await supabase
      .from('elemento')
      .select('ElemId, ElemNombre')
      .eq("TipoId", tipoId);

    if (elementosError) {
      setError('Error al obtener los elementos: ' + elementosError.message);
    } else {
      setElementos(elementosData); 
    }
  };

  const handleTipoChange = (e) => {
    setTipoId(e.target.value);
    fetchElementos(e.target.value);  
  };

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
          UsuaId: usuario.UsuaId,
          ElemId: elementoId  
        }])
        .select(); 
  
      if (insertError) {
        setError('Error al agregar el elemento: ' + insertError.message);
      } else if (data && data.length > 0) {  
        setItems(prevItems => [...prevItems, data[0]]);
        onClose(); 
        window.alert('¡Elemento agregado exitosamente!');
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
          <label htmlFor="tipo">Tipo:</label>
          <select 
            id="tipo" 
            name="tipo" 
            value={tipoId} 
            onChange={handleTipoChange} 
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map(tipo => (
              <option key={tipo.TipoId} value={tipo.TipoId}>
                {tipo.TipoNombre}
              </option>
            ))}
          </select>
          
          <label htmlFor="elemento">Elemento:</label>
          <select 
            id="elemento" 
            name="elemento"
            value={elementoId} 
            onChange={(e) => setElementoId(e.target.value)} 
            required
          >
            <option value="">Selecciona un elemento</option>
            {elementos.map(elemento => (
              <option key={elemento.ElemId} value={elemento.ElemId}>
                {elemento.ElemNombre}
              </option>
            ))}
          </select>

          <label htmlFor="serial">Serial:</label>
          <input 
            id="serial" 
            name="serial"
            type="text" 
            value={serial} 
            onChange={(e) => setSerial(e.target.value)} 
            required 
          />

          <label htmlFor="marca">Marca:</label>
          <input 
            id="marca" 
            name="marca"
            type="text" 
            value={marca} 
            onChange={(e) => setMarca(e.target.value)} 
            required 
          />

          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
}
