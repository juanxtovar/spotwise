import ContainerDashboard from "../Conductor/containerDashboard";
import './styles/validacionusuarios.scss';
import Header from "./header2";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function AutorizacionObjetos() {
    const [objetos, setObjetos] = useState([]);

    const fetchObjetosConUsuarios = async () => {
        let { data, error } = await supabase
            .from('vista_ingreso_elementos') 
            .select('*') 
            .order('InAutorizado', { ascending: true });

        if (error) {
            console.error("Error fetching objects: ", error);
        } else {
            setObjetos(data);
        }
    };

    const toggleAutorizacion = async (InSerial, InAutorizado) => {
        let { data, error } = await supabase
            .from('ingresoElementos') 
            .update({ InAutorizado: !InAutorizado }) 
            .eq('InSerial', InSerial);

        if (error) {
            console.error("Error updating authorization: ", error);
        } else {
            fetchObjetosConUsuarios(); 
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
