import { useState, useEffect } from 'react';
import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/salidaentrada.scss';
import Header from "./header2";
import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function SalidaEntrada() {
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [vehiculoData, setVehiculoData] = useState(null);
  const [availability, setAvailability] = useState({});
  const [planillas, setPlanillas] = useState([]);
  const [vehId, setVehId] = useState(null);
  const [usuaId, setUsuaId] = useState(null);
  const [sedId, setSedId] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  

  const obtenerAdminYSede = async () => {
    const selectedSede = JSON.parse(localStorage.getItem('selectedSede'));
    if (!selectedSede || !selectedSede.SedId) {
      alert('Sede no seleccionada. Por favor selecciona una sede antes de continuar.');
      return null; 
    }
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData) {
      console.error('Error al obtener la sesión:', sessionError);
      return null;
    }
  
    const { session } = sessionData;
    const authId = session.user.id;
  
    const { data: adminData, error: adminError } = await supabase
      .from('usuarios')
      .select('UsuaNombre, UsuaApellido')
      .eq('AuthId', authId)
      .single();
  
    if (adminError || !adminData) {
      console.error('Error al obtener los datos del administrador:', adminError);
      return null;
    }
  
    const adminNombreCompleto = `${adminData.UsuaNombre} ${adminData.UsuaApellido}`;
    return { adminNombreCompleto, sedId: selectedSede.SedId };
  };
  
  

  const buscarVehiculoPorPlaca = async () => {
    const { data: vehiculo, error } = await supabase
      .from('vehiculo')
      .select('*')
      .ilike('VehPlaca', `%${vehicleInfo}%`)
      .single();

    if (error || !vehiculo) {
      alert('Vehículo no encontrado');
      return null; 
    }

    setVehiculoData(vehiculo); 
    return vehiculo;
  };
  const actualizarDisponibilidad = async () => {
    const { data, error } = await supabase
      .from('parqueo')
      .select('ParqId, ParqCantidad, ParqTipo, SedeId');
    
    if (error) {
      console.error('Error al obtener disponibilidad de parqueo:', error);
      return;
    }

    console.log('Disponibilidad actualizada:', data);
  };


  const fetchPlanillas = async () => {
    const limit = 4; 
    const { data, error } = await supabase
      .from('entradasalida') 
      .select('*')
      .order('FechaEntrada', { ascending: false }) 
      .limit(limit);

    if (error) {
      console.error("Error al cargar planillas:", error);
    } else {
      setPlanillas(data);
    }
  };

  useEffect(() => {
    fetchPlanillas();
  }, []);  
  
  const verificarIngresoAnterior = async (vehId) => {
    const { data: ingresoPrevio, error } = await supabase
      .from('planilla')
      .select('FechaSalida')
      .eq('VehId', vehId)
      .order('FechaEntrada', { ascending: false })
      .limit(1)
      .single();
  
    if (error) {
      console.error('Error al verificar ingreso previo:', error);
      return true; 
    }
  
    return ingresoPrevio && ingresoPrevio.FechaSalida;
  };

  const verificarDisponibilidad = async (vehTipo, sedId) => {
    try {

      const { data, error } = await supabase
        .from('parqueo')
        .select('ParqCantidad')
        .eq('ParqTipo', vehTipo)
        .eq('SedeId', sedId)
        .single(); 
  
      if (error) {
        console.error('Error al verificar disponibilidad:', error);
        return false;  
      }
  
      if (data && data.ParqCantidad > 0) {
    
        return true;
      } else {
        return false; 
      }
    } catch (error) {
      console.error('Error inesperado en verificarDisponibilidad:', error);
      return false;
    }
  };
  
  
  
  const registrarEntrada = async () => {
    const vehiculo = await buscarVehiculoPorPlaca();
    if (!vehiculo) return;
  
    const permitido = await verificarIngresoAnterior(vehiculo.VehId);
    if (!permitido) {
      alert('Este vehículo ya está registrado en el estacionamiento y debe registrar una salida antes de ingresar nuevamente.');
      return;
    }
  
    const adminYSede = await obtenerAdminYSede();
    if (!adminYSede) return;
  
    const { adminNombreCompleto, sedId } = adminYSede;
    const hayDisponibilidad = await verificarDisponibilidad(vehiculo.VehTipo, sedId);
    if (!hayDisponibilidad) {
      alert('No hay espacios disponibles para este tipo de vehículo.');
      return;
    }
  
    try {
      const colombianTime = DateTime.now().setZone('America/Bogota').toISO();

      const { data, error: getError } = await supabase
        .from('parqueo')
        .select('ParqId, ParqCantidad, ParqUbicacion')
        .eq('ParqTipo', vehiculo.VehTipo)
        .eq('SedeId', sedId);
  
      if (getError) {
        console.error('Error al obtener disponibilidad del parqueo:', getError);
        alert('No se pudo obtener disponibilidad del parqueo.');
        return;
      }
  
   
      let registroDisponible = null;
      for (let i = 0; i < data.length; i++) {
        if (data[i].ParqCantidad > 0) {
          registroDisponible = data[i];
          break; 
        }
      }
  
      if (registroDisponible) {
       
        const { error: updateError } = await supabase
          .from('parqueo')
          .update({ ParqCantidad: registroDisponible.ParqCantidad - 1 })
          .eq('ParqId', registroDisponible.ParqId);
  
        if (updateError) {
          console.error('Error al decrementar la cantidad de parqueo:', updateError);
          alert('No se pudo actualizar la disponibilidad del parqueo.');
          return;
        }
  
       
        const { error: insertError } = await supabase.from('planilla').insert({
          FechaEntrada: colombianTime,
          AdminEntrada: adminNombreCompleto,
          VehId: vehiculo.VehId,
          UsuaId: vehiculo.UsuaId,
          SedId: sedId,
        });
  
        if (insertError) {
          console.error('Error al registrar entrada:', insertError);
          alert('No se pudo registrar la entrada');
        } else {
          alert('Entrada registrada exitosamente');
        }
      } else {
        alert('No hay espacio disponible para este tipo de vehículo.');
      }
      actualizarDisponibilidad();
      fetchPlanillas();
      
    } catch (error) {
      console.error('Error en registrarEntrada:', error);
      alert('Error inesperado al registrar la entrada');
    }
  };
  
  
  const registrarSalida = async () => {
    try {
  
      const vehiculo = await buscarVehiculoPorPlaca();
      if (!vehiculo) {
        alert('Vehículo no encontrado');
        return;
      }
  
      const vehId = vehiculo.VehId;
  
    
      const { data: ingresoPrevio, error: ingresoPrevioError } = await supabase
        .from('planilla')
        .select('PlanId, FechaEntrada, FechaSalida')
        .eq('VehId', vehId)
        .is('FechaSalida', null) 
        .order('FechaEntrada', { ascending: false })
        .limit(1)
        .single();
  
      if (ingresoPrevioError || !ingresoPrevio) {
        console.error('Error al obtener ingreso previo:', ingresoPrevioError);
        alert('No se encontró un registro de entrada pendiente de salida');
        return;
      }
  
      console.log('Ingreso previo encontrado:', ingresoPrevio); 
  
      const adminYSede = await obtenerAdminYSede();
      if (!adminYSede) return;
      const { adminNombreCompleto, sedId } = adminYSede;
  
      const colombianTime = DateTime.now().setZone('America/Bogota').toISO();
  
    
      const { data: updateData, error: updateError } = await supabase
        .from('planilla')
        .update({
          FechaSalida: colombianTime,
          AdminSalida: adminNombreCompleto
        })
        .eq('PlanId', ingresoPrevio.PlanId);
  
      if (updateError) {
        console.error('Error al actualizar salida:', updateError);
        alert('No se pudo registrar la salida');
        return;
      }
  
      console.log('Salida registrada con éxito en planilla:', updateData);
  
 
      const { data, error: getError } = await supabase
        .from('parqueo')
        .select('ParqId, ParqCantidad, ParqUbicacion')
        .eq('ParqTipo', vehiculo.VehTipo)
        .eq('SedeId', sedId);
  
      if (getError) {
        console.error('Error al obtener disponibilidad del parqueo:', getError);
        alert('No se pudo obtener disponibilidad del parqueo.');
        return;
      }
  
      console.log('Datos de parqueo disponibles:', data);
  
      let registroDisponible = null;
      for (let i = 0; i < data.length; i++) {
     
        if (data[i].ParqCantidad > 0) {
          registroDisponible = data[i];
          break; 
        }
      }
  
      if (registroDisponible) {
        const { error: incrementError } = await supabase
          .from('parqueo')
          .update({ ParqCantidad: registroDisponible.ParqCantidad + 1 })
          .eq('ParqId', registroDisponible.ParqId);
  
        if (incrementError) {
          console.error('Error al incrementar disponibilidad del parqueo:', incrementError);
          alert('No se pudo actualizar la disponibilidad del parqueo.');
          return;
        }
  
        alert('Salida registrada exitosamente');
      } else {
        alert('No se pudo actualizar la disponibilidad del parqueo.');
      }

      actualizarDisponibilidad();
      fetchPlanillas();

    } catch (error) {
      console.error('Error en registrarSalida:', error);
      alert('Error inesperado al registrar la salida');
    }
  };
  
  
  
  const cargarDisponibilidad = async (sedeId) => {
    try {
      const { data, error } = await supabase
        .from('parqueo')
        .select('ParqCantidad, ParqTipo, ParqUbicacion')
        .eq('SedeId', sedeId);
  
      if (error) {
        console.error('Error al cargar disponibilidad:', error);
        alert('No se pudo cargar la disponibilidad.');
        return;
      }
  
      setDisponibilidad(data || []); 
    } catch (error) {
      console.error('Error inesperado al cargar disponibilidad:', error);
      alert('Error inesperado al cargar la disponibilidad.');
    }
  };

  useEffect(() => {
    const selectedSede = JSON.parse(localStorage.getItem('selectedSede'));
    if (selectedSede && selectedSede.SedId) {
      cargarDisponibilidad(selectedSede.SedId);
    } else {
      alert('Sede no seleccionada. Por favor selecciona una sede antes de continuar.');
    }
  }, []);

  return (
    <ContainerDashboard>
      <Header />
      <main className="main-content">
        <div className="container-sections">

          <div className="input-section">
            <label htmlFor="vehicle-info">Ingresa la placa o número de serie del vehículo:</label>
            <input
              id="vehicle-info"
              type="text"
              placeholder="Número de placa o serie"
              value={vehicleInfo}
              onChange={(e) => setVehicleInfo(e.target.value)}
            />
            <div className="button-container">
              <button type="button" onClick={registrarEntrada}>Registrar Entrada</button>
              <button type="button" onClick={registrarSalida}>Registrar Salida</button>
            </div>
          </div>

          <div className="availability-section">
            <h1>Disponibilidad</h1>
                  {disponibilidad.length > 0 ? (
        <ul>
            {disponibilidad.map((parqueo, index) => (
        <li key={index}>
          <strong>Tipo:</strong> {parqueo.ParqTipo} <br />
          <strong>Espacios:</strong> {parqueo.ParqCantidad} <br />
          <strong>Ubicación:</strong> {parqueo.ParqUbicacion}
        </li>
      ))}
    </ul>
  ) : (
    <p>No hay información de disponibilidad para esta sede.</p>
  )}
</div>
        </div>

        <div className="table-section">
          <h2>Planilla</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Tipo</th>
                <th>Placa</th>
                <th>Autorizado</th>
                <th>Fecha Entrada</th>
                <th>Fecha Salida</th>
                <th>Duración</th>
                <th>Administrador Entrada</th>
                <th>Administrador Salida</th>
                <th>Sede</th>
              </tr>
            </thead>
            <tbody>
              {planillas.length > 0 ? (
                planillas.map((planilla, index) => (
                  <tr key={`${planilla.UsuaId}-${index}`}>
                    <td>{planilla.UsuaNombre}</td>
                    <td>{planilla.UsuaApellido}</td>
                    <td>{planilla.UsuaTipo}</td>
                    <td>{planilla.VehPlaca}</td>
                    <td>{planilla.VehAutorizacion}</td>
                    <td>{planilla.FechaEntrada}</td>
                    <td>{planilla.FechaSalida}</td>
                    <td>{planilla.DuracionEstacionamiento}</td>
                    <td>{planilla.AdminEntrada}</td>
                    <td>{planilla.AdminSalida}</td>
                    <td>{planilla.SedNombre}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">No hay planillas disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </ContainerDashboard>
  );  
}
