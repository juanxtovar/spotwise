import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AiOutlineClose } from 'react-icons/ai'; 
import AddElemento from './addElemento'; 
import './styles/cardElementos.scss'; 

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function CardElemento() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setError('Error al obtener el usuario autenticado.');
          setLoading(false);
          return;
        }

        const { data: usuario, error: usuarioError } = await supabase
          .from('usuarios')
          .select('UsuaId')
          .eq('AuthId', user.id)
          .single();

        if (usuarioError || !usuario) {
          setError('Error al obtener el UsuaId del usuario.');
          setLoading(false);
          return;
        }

        const usuaId = usuario.UsuaId;

        const { data: items, error: itemsError } = await supabase
          .from('vista_ingreso_elementos') 
          .select('*')
          .eq('UsuaId', usuaId);

        if (itemsError) {
          setError('Error al obtener los elementos: ' + itemsError.message);
          setLoading(false);
          return;
        }

        setItems(items);
        setLoading(false);
      } catch (err) {
        setError('Error inesperado al obtener los datos.');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('ingresoElementos')
        .delete()
        .eq('InId', id);

      if (error) {
        setError('Error al eliminar el elemento: ' + error.message);
      } else {
        setItems(items.filter(item => item.InId !== id));
      }
    } catch (err) {
      setError('Error inesperado al eliminar el elemento.');
    }
  };

  if (loading) return <p>Cargando elementos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="element-container">
      <div className="container-title">
        <h2 className="title">Mis Elementos</h2>
        <p className="title-length">({items.length})</p>
      </div>
      {items.length > 0 ? (
        <div className="element-list">
          {items.map(item => (
            <div key={item.InId} className="element-card">
              <AiOutlineClose 
                className="delete-icon" 
                onClick={() => handleDelete(item.InId)} 
              />
              <div 
                className={`autorizacion-status ${item.InAutorizado ? 'authorized' : 'not-authorized'}`}
              >
              </div>
              <div className="container-info">
                <h3>{item.nombre_elemento}</h3> 
                <div className="container-p">
                  <p>{item.InMarca}</p>
                  <p>{item.InSerial}</p> 
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay elementos registrados.</p>
      )}

      <button className="add-element-button" onClick={handleAdd}>Agregar Elemento</button>
      {isModalOpen && (
        <AddElemento isOpen={isModalOpen} onClose={handleCloseModal} setItems={setItems} />
      )}
    </div>
  );
}
