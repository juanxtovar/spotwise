import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./styles/RegistrarInvitado.scss";
import { useNavigate } from "react-router-dom";

const supabase = createClient("https://kfptoctchniilzgtffns.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmcHRvY3RjaG5paWx6Z3RmZm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5ODQ2MDEsImV4cCI6MjA0MTU2MDYwMX0.M01co6Y65XOSXHvViCSalZRCrVnNLAAPnqcZKjxuBrE");

const RegistrarInvitado = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    vehTipo: "Moto",
    placa: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .insert({
          UsuaNombre: formData.nombre,
          UsuaApellido: formData.apellido,
          UsuaTipo: "Invitado",
          UsuaActivo: 1,
          UsuaCorreo: `${formData.nombre.toLowerCase()}.${formData.apellido.toLowerCase()}@invitado.com`,
          UsuaContraseña: "invitado123",
          UsuaTelefono: "0000000000"
        })
        .select()
        .single();

      if (usuarioError) throw usuarioError;

     
      const { error: vehiculoError } = await supabase.from("vehiculo").insert({
        VehTipo: formData.vehTipo,
        VehPlaca: formData.placa,
        VehMarca: "Desconocida",
        VehAutorizacion: true,
        UsuaId: usuario.UsuaId
      });

      if (vehiculoError) throw vehiculoError;

      alert("Invitado registrado con éxito");
      setFormData({
        nombre: "",
        apellido: "",
        vehTipo: "Moto",
        placa: ""
      });

      
      navigate("/SalidaEntrada");
    } catch (error) {
      console.error("Error al registrar invitado:", error);
      alert("Hubo un error al registrar al invitado. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Registrar Invitado</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
          <label>Vehículo:</label>
          <select name="vehTipo" value={formData.vehTipo} onChange={handleChange}>
            <option value="Moto">Moto</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Carro">Carro</option>
            <option value="Monopatín Eléctrico">Monopatín Eléctrico</option>
          </select>
          <label>Placa:</label>
          <input
            type="text"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarInvitado;
