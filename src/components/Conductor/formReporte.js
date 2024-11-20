import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './styles/formReporte.scss'; 

const supabase = createClient(
  'https://kfptoctchniilzgtffns.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE'
);

const ReportePlanillaUsuarios = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [reporte, setReporte] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [usuaId, setUsuaId] = useState(null);
  
    useEffect(() => {
      const fetchUserAndId = async () => {
        try {
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();
  
          if (authError) throw authError;
          if (!user) throw new Error('Usuario no autenticado.');
  
          const authId = user.id;
  
          const { data: usuarioData, error: usuarioError } = await supabase
            .from('usuarios')
            .select('UsuaId')
            .eq('AuthId', authId)
            .single();
  
          if (usuarioError) throw usuarioError;
  
          setUsuaId(usuarioData.UsuaId);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchUserAndId();
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
        if (!usuaId) throw new Error('No se pudo obtener el ID del usuario.');
  
        const { data, error } = await supabase
          .rpc('obtener_planilla_por_fecha_usuarios', {
            user_id: usuaId,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          });
  
        if (error) throw error;
  
        console.log(data); 
        setReporte(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="reporte-planilla">
        <h2>Generar Reporte de Ingreso y Salida</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Fecha Inicio:
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </label>
          <label>
            Fecha Fin:
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading || !usuaId}>
            {loading ? 'Generando...' : 'Generar Reporte'}
          </button>
        </form>
  
        {error && <p className="error">Error: {error}</p>}
        {reporte && (
          <div className="reporte">
            <h3>Resultados del Reporte</h3>
            <table>
              <thead>
                <tr>
                  <th>Marca del Vehículo</th>
                  <th>Placa del Vehículo</th>
                  <th>Fecha de Entrada</th>
                  <th>Fecha de Salida</th>
                  <th>Duración del Estacionamiento</th>
                </tr>
              </thead>
              <tbody>
                {reporte.map((usuario, index) => (
                  <tr key={index}>
                    <td>{usuario.vehmarca}</td>
                    <td>{usuario.vehplaca}</td>
                    <td>{usuario.fechaentrada}</td>
                    <td>{usuario.fechasalida}</td>
                    <td>{usuario.duracionestacionamiento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  
  export default ReportePlanillaUsuarios;