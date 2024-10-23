import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/validacion.scss';
import Header from "../Conductor/header";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AutorizacionVehiculos() {
    const [vehiculos, setVehiculos] = useState([]);

    // Consulta para obtener los datos de la tabla vehiculo y usuarios
    const fetchVehiculosConUsuarios = async () => {
        let { data, error } = await supabase
            .from('vehiculo') // Tabla de vehiculos
            .select(`
                VehPlaca,
                VehTipo,
                VehAutorizacion,
                usuarios!inner(UsuaNombre, UsuaApellido)
            `)
            .order('VehAutorizacion', { ascending: true }); // Ordenar por VehAutorizacion: no autorizados primero

        if (error) {
            console.error("Error fetching vehicles: ", error);
        } else {
            setVehiculos(data);
        }
    };

    // Función para actualizar el estado de autorización
    const toggleAutorizacion = async (VehPlaca, VehAutorizacion) => {
        let { data, error } = await supabase
            .from('vehiculo')
            .update({ VehAutorizacion: !VehAutorizacion }) // Cambia el estado de autorización
            .eq('VehPlaca', VehPlaca);

        if (error) {
            console.error("Error updating authorization: ", error);
        } else {
            fetchVehiculosConUsuarios(); // Refresca los datos después de la actualización
        }
    };

    useEffect(() => {
        fetchVehiculosConUsuarios();
    }, []);

    return (
        <ContainerDashboard>
            <Header />
            <main className="main-content">
                <div className="validacion-section">
                    <h1>Autorización de Vehículos</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Placa</th>
                                <th>Tipo de Vehículo</th>
                                <th>Autorización</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map((vehiculo, index) => (
                                <tr key={index}>
                                    <td>{vehiculo.usuarios.UsuaNombre}</td>
                                    <td>{vehiculo.usuarios.UsuaApellido}</td>
                                    <td>{vehiculo.VehPlaca}</td>
                                    <td>{vehiculo.VehTipo}</td>
                                    <td>{vehiculo.VehAutorizacion ? 'Sí' : 'No'}</td>
                                    <td>
                                    <button
                                        className={vehiculo.VehAutorizacion ? 'auth-button desautorizar' : 'auth-button autorizar'}
                                        onClick={() => toggleAutorizacion(vehiculo.VehPlaca, vehiculo.VehAutorizacion)}
                                    >
                                    {vehiculo.VehAutorizacion ? 'Desautorizar' : 'Autorizar'}
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </ContainerDashboard>
    );
}
