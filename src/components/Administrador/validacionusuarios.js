import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/validacionusuarios.scss';
import Header from "../Conductor/header";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AutorizacionObjetos() {
    const [objetos, setObjetos] = useState([]);

    // Consulta para obtener los datos de la vista vista_ingreso_elementos
    const fetchObjetosConUsuarios = async () => {
        let { data, error } = await supabase
            .from('vista_ingreso_elementos') // Usamos la vista directamente
            .select('*') // Seleccionamos todas las columnas
            .order('InAutorizado', { ascending: true }); // Ordenar por InAutorizado: no autorizados primero

        if (error) {
            console.error("Error fetching objects: ", error);
        } else {
            setObjetos(data);
        }
    };

    // Función para actualizar el estado de autorización de un objeto
    const toggleAutorizacion = async (InSerial, InAutorizado) => {
        let { data, error } = await supabase
            .from('ingresoElementos') // Actualizamos en la tabla original, no en la vista
            .update({ InAutorizado: !InAutorizado }) // Cambiar el estado de autorización
            .eq('InSerial', InSerial); // Usamos el serial como identificador único

        if (error) {
            console.error("Error updating authorization: ", error);
        } else {
            fetchObjetosConUsuarios(); // Refrescar datos después de la actualización
        }
    };

    useEffect(() => {
        fetchObjetosConUsuarios();
    }, []);

    return (
        <ContainerDashboard>
            <Header />
            <main className="main-content">
                <div className="validacion-section">
                    <h1>Autorización de Objetos</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Elemento</th>
                                <th>Tipo de Elemento</th>
                                <th>Serial</th>
                                <th>Marca</th>
                                <th>Autorización</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objetos.map((objeto, index) => (
                                <tr key={index}>
                                    <td>{objeto.UsuaNombre}</td>
                                    <td>{objeto.UsuaApellido}</td>
                                    <td>{objeto.ElemNombre}</td>
                                    <td>{objeto.TipoNombre}</td>
                                    <td>{objeto.InSerial}</td>
                                    <td>{objeto.InMarca}</td>
                                    <td>{objeto.InAutorizado ? 'Sí' : 'No'}</td>
                                    <td>
                                        <button
                                            className={objeto.InAutorizado ? 'auth-button desautorizar' : 'auth-button autorizar'}
                                            onClick={() => toggleAutorizacion(objeto.InSerial, objeto.InAutorizado)}
                                        >
                                            {objeto.InAutorizado ? 'Desautorizar' : 'Autorizar'}
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
