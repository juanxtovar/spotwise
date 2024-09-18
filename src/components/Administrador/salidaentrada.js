import { useState, useEffect } from 'react';
import ContainerDashboard from "../containerDashboard";
import './styles/salidaentrada.scss';
import Header from "../header";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function SalidaEntrada() {
  const [planillas, setPlanillas] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [vehiculoData, setVehiculoData] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState({
    bicicletas: 12,
    motos: 8,
    carros: 20,
    otros: 5,
  });

  const fetchPlanillas = async () => {
    const { data, error } = await supabase
      .from('planilla')
      .select('PlanId, FechaEntrada, FechaSalida, DuracionEstacionamiento, AdminEntrada, AdminSalida, VehId, UsuaId, ParqId');
    
    if (error) {
      console.error('Error fetching planillas:', error);
    } else {
      setPlanillas(data);
    }
  };

  useEffect(() => {
    fetchPlanillas();
  }, []);


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
    actualizarDisponibilidad(vehiculo.VehTipo); 
    return vehiculo;
  };

  const actualizarDisponibilidad = (tipoVehiculo) => {
    setDisponibilidad((prevDisponibilidad) => {
      switch (tipoVehiculo) {
        case 'bicicleta':
          return { ...prevDisponibilidad, bicicletas: prevDisponibilidad.bicicletas - 1 };
        case 'moto':
          return { ...prevDisponibilidad, motos: prevDisponibilidad.motos - 1 };
        case 'carro':
          return { ...prevDisponibilidad, carros: prevDisponibilidad.carros - 1 };
        default:
          return { ...prevDisponibilidad, otros: prevDisponibilidad.otros - 1 };
      }
    });
  };

  const handleRegistrarEntrada = async () => {
    try {
      const vehiculo = await buscarVehiculoPorPlaca();
      if (!vehiculo) return; 
  
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuarios')
        .select('*')
        .eq('UsuaId', vehiculo.UsuaId)
        .single();
  
      if (errorUsuario || !usuario) {
        alert('Usuario no encontrado');
        return;
      }
  
      const { error: insertError } = await supabase
        .from('planilla')
        .insert([
          {
            FechaEntrada: new Date().toISOString(),
            AdminEntrada: 'root',
            VehId: vehiculo.VehId,
            UsuaId: usuario.UsuaId,
            ParqId: 1, 
            FechaSalida: null,
            DuracionEstacionamiento: null,
            AdminSalida: null,
          },
        ]);
  
      if (insertError) {
        console.error('Error al registrar la entrada:', insertError);
        alert('Error al registrar la entrada. Verifica los permisos o políticas de seguridad.');
      } else {
        alert('Entrada registrada exitosamente');
        fetchPlanillas(); 
      }
    } catch (error) {
      console.error('Error registrando entrada:', error);
    }
  };
  
  const handleRegistrarSalida = async () => {
    try {
      const vehiculo = await buscarVehiculoPorPlaca();
      if (!vehiculo) return; 
  
      const { data: planilla, error: errorPlanilla } = await supabase
        .from('planilla')
        .select('*')
        .eq('VehId', vehiculo.VehId)
        .is('FechaSalida', null)
        .single();
  
      if (errorPlanilla || !planilla) {
        alert('No se encontró una planilla activa para este vehículo');
        return;
      }
  
      const fechaSalida = new Date();
      const fechaEntrada = new Date(planilla.FechaEntrada);
      const duracionEstacionamiento = Math.floor((fechaSalida - fechaEntrada) / (1000 * 60));
  
      const { error: updateError } = await supabase
        .from('planilla')
        .update({
          FechaSalida: fechaSalida.toISOString(),
          DuracionEstacionamiento: `${Math.floor(duracionEstacionamiento / 60)
            .toString()
            .padStart(2, '0')}:${(duracionEstacionamiento % 60)
            .toString()
            .padStart(2, '0')}:00`,
          AdminSalida: 'root',
        })
        .eq('PlanId', planilla.PlanId);
  
      if (updateError) {
        console.error('Error al registrar la salida:', updateError);
        alert('Error al registrar la salida. Verifica los permisos o políticas de seguridad.');
      } else {
        alert('Salida registrada exitosamente');
        fetchPlanillas(); 
      }
    } catch (error) {
      console.error('Error registrando salida:', error);
    }
  };
  
  
  

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
              <button type="button" onClick={handleRegistrarEntrada}>Registrar Entrada</button>
              <button type="button" onClick={handleRegistrarSalida}>Registrar Salida</button>
            </div>
          </div>

          <div className="availability-section">
            <h1>Disponibilidad</h1>
            <div className="availability-item">
              <p>Bicicletas:</p>
              <span>{disponibilidad.bicicletas}</span>
            </div>
            <div className="availability-item">
              <p>Motos:</p>
              <span>{disponibilidad.motos}</span>
            </div>
            <div className="availability-item">
              <p>Carros:</p>
              <span>{disponibilidad.carros}</span>
            </div>
            <div className="availability-item">
              <p>Otros:</p>
              <span>{disponibilidad.otros}</span>
            </div>
          </div>
        </div>
        <div className="table-section">
          <h2>Planilla</h2>
          <table>
            <thead>
              <tr>
                <th>ID Planilla</th>
                <th>Fecha Entrada</th>
                <th>Fecha Salida</th>
                <th>Duración</th>
                <th>Administrador Entrada</th>
                <th>Administrador Salida</th>
                <th>Vehículo</th>
                <th>Usuario</th>
                <th>Parqueadero</th>
              </tr>
            </thead>
            <tbody>
              {planillas.length > 0 ? (
                planillas.map((planilla) => (
                  <tr key={planilla.PlanId}>
                    <td>{planilla.PlanId}</td>
                    <td>{planilla.FechaEntrada}</td>
                    <td>{planilla.FechaSalida || 'N/A'}</td>
                    <td>{planilla.DuracionEstacionamiento}</td>
                    <td>{planilla.AdminEntrada}</td>
                    <td>{planilla.AdminSalida || 'N/A'}</td>
                    <td>{planilla.VehId}</td>
                    <td>{planilla.UsuaId}</td>
                    <td>{planilla.ParqId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No hay planillas disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </ContainerDashboard>
  );
}
