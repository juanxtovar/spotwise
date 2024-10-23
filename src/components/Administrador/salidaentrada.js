import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/salidaentrada.scss';
import Header from "../Conductor/header";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function SalidaEntrada() {
  const [planillas, setPlanillas] = useState([]);
  const [availability, setAvailability] = useState({});
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [vehiculoData, setVehiculoData] = useState(null);

  const fetchAvailability = async () => {
    // Obtener la sede seleccionada de localStorage
    const selectedSede = JSON.parse(localStorage.getItem('selectedSede'));
    
    if (!selectedSede || !selectedSede.SedId) {
      console.error('Sede no seleccionada.');
      return;
    }
  
    const { data, error } = await supabase
      .from('parqueo')
      .select('*')
      .eq('SedeId', selectedSede.SedId); // Filtrar por la sede actual
  
    if (error) {
      console.error('Error fetching availability:', error);
    } else {
      const availableSpaces = {};
      data.forEach(item => {
        availableSpaces[item.ParqTipo] = item.ParqCantidad; // Almacenar disponibilidad por tipo
      });
      setAvailability(availableSpaces);
    }
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

  const handleRegistrarEntrada = async () => {
    try {
      const vehiculo = await buscarVehiculoPorPlaca();
      if (!vehiculo) {
        alert('Vehículo no encontrado');
        return;
      }
  
      // Verificar si el vehículo ya tiene una entrada activa
      const { data: entradaActiva, error: errorEntradaActiva } = await supabase
        .from('planilla')
        .select('*')
        .eq('VehId', vehiculo.VehId)
        .is('FechaSalida', null) // Verifica si hay una entrada sin salida
        .single();
  
      if (errorEntradaActiva) {
        console.error('Error al verificar entrada activa:', errorEntradaActiva);
        alert('Error al verificar el estado del vehículo.');
        return;
      }
  
      if (entradaActiva) {
        alert('El vehículo ya está registrado. Debe salir antes de ingresar nuevamente.');
        return;
      }
  
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuarios')
        .select('*')
        .eq('UsuaId', vehiculo.UsuaId)
        .single();
  
      if (errorUsuario || !usuario) {
        alert('Usuario no encontrado');
        return;
      }
  
      // Obtener la sesión actual del administrador
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Error al obtener la sesión:', sessionError);
        alert('Error al obtener la sesión del administrador');
        return;
      }
  
      const authId = session.user.id;
  
      // Obtener el nombre del administrador
      const { data: adminData, error: adminError } = await supabase
        .from('usuarios')
        .select('UsuaNombre, UsuaApellido')
        .eq('AuthId', authId)
        .single();
  
      if (adminError || !adminData) {
        console.error('Error al obtener los datos del administrador:', adminError);
        alert('No se pudo obtener el nombre del administrador');
        return;
      }
  
      const adminNombreCompleto = `${adminData.UsuaNombre} ${adminData.UsuaApellido}`;
  
      // Obtener la sede seleccionada de localStorage
      const selectedSede = JSON.parse(localStorage.getItem('selectedSede'));
      if (!selectedSede || !selectedSede.SedId) {
        alert('Sede no seleccionada. Por favor selecciona una sede antes de continuar.');
        return;
      }
  
      const fechaConZonaHoraria = new Date();
      fechaConZonaHoraria.setHours(fechaConZonaHoraria.getHours() - fechaConZonaHoraria.getTimezoneOffset() / 60);
  
      // Obtener el tipo de vehículo
      const tipoVehiculo = vehiculo.VehTipo;
  
      // Verificar disponibilidad en la tabla parqueo
      const { data: disponibilidad, error: errorDisponibilidad } = await supabase
        .from('parqueo')
        .select('*')
        .eq('SedeId', selectedSede.SedId)
        .eq('ParqTipo', tipoVehiculo)
        .single();
  
      if (errorDisponibilidad || !disponibilidad || disponibilidad.ParqCantidad <= 0) {
        alert('No hay espacios disponibles para este tipo de vehículo.');
        return;
      }
  
      // Actualizar la disponibilidad reduciendo el contador
      const newCount = disponibilidad.ParqCantidad - 1;
  
      const { error: updateError } = await supabase
        .from('parqueo')
        .update({ ParqCantidad: newCount })
        .eq('ParqId', disponibilidad.ParqId); // Asegúrate de tener la ParqId
  
      if (updateError) {
        console.error('Error actualizando la disponibilidad:', updateError);
        alert('Error al actualizar la disponibilidad.');
        return;
      }
  
      // Insertar el registro en la tabla 'planilla', utilizando SedId
      const { error: insertError } = await supabase
        .from('planilla')
        .insert([{
          FechaEntrada: fechaConZonaHoraria.toISOString(),
          AdminEntrada: adminNombreCompleto,
          VehId: vehiculo.VehId,
          UsuaId: usuario.UsuaId,
          SedId: selectedSede.SedId, // Cambiado a SedId
          FechaSalida: null,
          DuracionEstacionamiento: null,
          AdminSalida: null,
        }]);
  
      if (insertError) {
        console.error('Error al registrar la entrada:', insertError);
        alert('Error al registrar la entrada. Verifica los permisos o políticas de seguridad.');
      } else {
        alert('Entrada registrada exitosamente');
        fetchPlanillas(); // Actualizar la tabla de planillas
        fetchAvailability(); // Actualizar disponibilidad
      }
    } catch (error) {
      console.error('Error registrando entrada:', error);
      alert('Ocurrió un error inesperado al registrar la entrada.');
    }
  };






  // Definir la función calcularDuracion fuera de handleRegistrarSalida
const calcularDuracion = (fechaEntrada, fechaSalida) => {
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);

  const diffMs = salida - entrada; // Diferencia en milisegundos
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); // Diferencia en horas
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Diferencia en minutos

  return `${diffHrs} horas y ${diffMins} minutos`;
};

const handleRegistrarSalida = async () => {
  try {
    const vehiculo = await buscarVehiculoPorPlaca();
    if (!vehiculo) {
      alert('Vehículo no encontrado');
      return;
    }

    // Obtener la sesión actual del administrador
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('Error al obtener la sesión:', sessionError);
      alert('Error al obtener la sesión del administrador');
      return;
    }

    const authId = session.user.id;

    // Obtener el nombre del administrador
    const { data: adminData, error: adminError } = await supabase
      .from('usuarios')
      .select('UsuaNombre, UsuaApellido')
      .eq('AuthId', authId)
      .single();

    if (adminError || !adminData) {
      console.error('Error al obtener los datos del administrador:', adminError);
      alert('No se pudo obtener el nombre del administrador');
      return;
    }

    // Obtener la sede seleccionada de localStorage
    const selectedSede = JSON.parse(localStorage.getItem('selectedSede'));
    if (!selectedSede || !selectedSede.SedId) {
      alert('Sede no seleccionada. Por favor selecciona una sede antes de continuar.');
      return;
    }

    // Verificar si el vehículo tiene una entrada activa
    const { data: entradaActiva, error: errorEntradaActiva } = await supabase
      .from('planilla')
      .select('*')
      .eq('VehId', vehiculo.VehId)
      .is('FechaSalida', null) // Asegúrate de que no tenga salida
      .single();

    if (errorEntradaActiva || !entradaActiva) {
      alert('No hay entrada activa para este vehículo. Debe ingresar primero.');
      return;
    }

    const fechaSalida = new Date();
    const duracionEstacionamiento = calcularDuracion(entradaActiva.FechaEntrada, fechaSalida);

    // Actualizar el registro de la entrada para registrar la salida
    const { error: updateError } = await supabase
      .from('planilla')
      .update({
        FechaSalida: fechaSalida.toISOString(),
        DuracionEstacionamiento: duracionEstacionamiento,
        AdminSalida: `${adminData.UsuaNombre} ${adminData.UsuaApellido}` // Ahora está definido
      })
      .eq('VehId', vehiculo.VehId)
      .is('FechaSalida', null); // Asegúrate de que se está actualizando el correcto

    // Verificar si hay error al actualizar
    if (updateError) {
      console.error('Error al registrar la salida:', updateError);
      alert('Error al registrar la salida. Detalles: ' + updateError.message);
      return;
    }

    // Actualizar la disponibilidad en parqueo
    const { data: disponibilidad, error: errorDisponibilidad } = await supabase
      .from('parqueo')
      .select('*')
      .eq('SedeId', selectedSede.SedId) // Ahora está definido
      .eq('ParqTipo', vehiculo.VehTipo)
      .limit(1)
      .single();

    // Verificar si disponibilidad es nulo
    if (errorDisponibilidad || !disponibilidad) {
      console.error('Error al obtener la disponibilidad:', errorDisponibilidad);
      alert('No se encontró disponibilidad para este tipo de vehículo.');
      return;
    }

    const newCount = disponibilidad.ParqCantidad + 1;

    const { error: updateParqueoError } = await supabase
      .from('parqueo')
      .update({ ParqCantidad: newCount })
      .eq('ParqId', disponibilidad.ParqId);

    // Verificar si hay error al actualizar parqueo
    if (updateParqueoError) {
      console.error('Error actualizando la disponibilidad:', updateParqueoError);
      alert('Error al actualizar la disponibilidad. Detalles: ' + updateParqueoError.message);
      return;
    }

    alert('Salida registrada exitosamente');
    fetchPlanillas(); // Actualizar la tabla de planillas
    fetchAvailability(); // Actualizar disponibilidad

  } catch (error) {
    console.error('Error registrando salida:', error);
    alert('Ocurrió un error inesperado al registrar la salida.');
  }
};
  
  
  
  

  useEffect(() => {
    fetchPlanillas();
    fetchAvailability(); // Llama a la función para obtener disponibilidad
  }, []);


  // fetchplanilla - useEffect
  const fetchPlanillas = async () => {
    const { data, error } = await supabase
      .from('entradasalida') // Cambia 'entradaSalida' por el nombre correcto de la vista
      .select('UsuaId, UsuaNombre, UsuaApellido, UsuaTipo, VehPlaca, VehAutorizacion, FechaEntrada, FechaSalida, DuracionEstacionamiento, AdminEntrada, AdminSalida, SedNombre')
      .order('FechaEntrada', { ascending: false }) 
      .limit(7); 

    if (error) {
      console.error('Error fetching planillas:', error);
    } else {
      setPlanillas(data);
    }
  };

  useEffect(() => {
    fetchPlanillas();
  }, []);
  
  return (
    <ContainerDashboard>
      <Header />
      <main className="main-content">
        <div className="container-sections">

          {/* Sección de entrada y salida */}
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
              <button type="button" onClick={handleRegistrarEntrada}>Registrar Entrada</button>
              <button type="button" onClick={handleRegistrarSalida}>Registrar Salida</button>
            </div>
          </div>

          {/* Sección de disponibilidad */}
          <div className="availability-section">
            <h1>Disponibilidad</h1>
            <ul>
              {Object.entries(availability).map(([tipo, espacios]) => (
                <li key={tipo}>{`${tipo}: ${espacios} espacios libres`}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sección de planillas */}
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
                    <td>{planilla.FechaSalida || 'N/A'}</td>
                    <td>{planilla.DuracionEstacionamiento || 'N/A'}</td>
                    <td>{planilla.AdminEntrada}</td>
                    <td>{planilla.AdminSalida || 'N/A'}</td>
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
