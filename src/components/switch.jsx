import { useState } from "react";
import axios from "axios";
import { checkQueryModule } from "../utils/chekQueryModule";
export default function ToggleSwitch() {

  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const nuevoEstado = !activo;

    // Cambiamos el estado visual inmediatamente
    setActivo(nuevoEstado);
    setLoading(true);

    try {
      if (nuevoEstado) {
        // Activado → llamar endpoint A
        await axios.post("http://localhost:3006/orchestration/query/enable");
      } else {
        // Desactivado → llamar endpoint B
        await axios.post("http://localhost:3006/orchestration/query/disable");
      }
    } catch (err) {
      console.error("Error en toggle:", err);

      // Si falla revertimos el estado
      setActivo(!nuevoEstado);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <label className="mr-3 font-medium">Servicio consulta</label>
    <button
      disabled={loading}
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
        ${activo ? "bg-green-500" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
          ${activo ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
    
    </div>
  );
}
