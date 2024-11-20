import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { LuUserCircle2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";


const supabase = createClient('https://kfptoctchniilzgtffns.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE');

export default function UserProfile() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error al obtener la sesión:", sessionError);
        setError('Error al obtener la sesión');
        setLoading(false);
        return;
      }

      if (session && session.user) {
        const authId = session.user.id;



        const { data: userData, error: userError } = await supabase
          .from('usuarios') 
          .select('UsuaNombre, UsuaApellido') 
          .eq('AuthId', authId) 
          .single(); 

        if (userError) {
          setError('Error al obtener datos del usuario');
          setLoading(false);
          return;
        }



        if (userData) {
          setUserName(`${userData.UsuaNombre} ${userData.UsuaApellido}`);
        } else {
          setError('No se encontraron datos para el usuario');
        }
      } else {
        setError('No hay sesión activa');
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const handlePerfil = () => {
    navigate('/perfilUsuario2');
  };
  return (
    <div className="user-profile" onClick={handlePerfil}>
      <button style={{
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#fff",
        fontSize:"16px",
        fontWeight:"bold",
        display:"flex",
        flexDirection:"row",
        alignItems:"center",  
        gap:"5px"
      }
      }>
      <LuUserCircle2 size={35}/>
      <p>{userName ? userName : "No se encontró información del usuario"}</p></button>
    </div>
  );
}
