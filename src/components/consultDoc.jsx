import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { mapPersonFromAPI, mapGender, mapDocumentType } from '../utils/personMapper';
import { validaciones } from '../utils/validations';

const ConsultDoc = ({ onClose, documento, onActualizar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    tipo_documento: "",
    nro_documento: "",
    primer_nombre: "",
    segundo_nombre: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    correo: "",
    celular: "",
    foto: null
  });
  const [datosOriginales, setDatosOriginales] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errores, setErrores] = useState({});
  const cargaInicialRef = useRef(false);

  useEffect(() => {
    if (cargaInicialRef.current) return;
    cargaInicialRef.current = true;
    const cargarPersona = async () => {
      try {
     
        const response = await fetch(`${API_ENDPOINTS.READ_PERSON}/${documento}`);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.data) {
    
            const personaMapeada = mapPersonFromAPI(result.data);
            setFormData(personaMapeada);
            setDatosOriginales(personaMapeada);
          } else {
            alert('Persona no encontrada');
            onClose();
          }
        } else {
          alert('Persona no encontrada');
          onClose();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos');
        onClose();
      } finally {
        setCargando(false);
      }
    };
    
    cargarPersona();
  }, [documento, onClose]);

  const validarCampo = (name, value) => {
    let resultado = { valido: true, mensaje: "" };

    switch (name) {
      case "primer_nombre":
        resultado = validaciones.validarPrimerNombre(value);
        break;
      case "segundo_nombre":
        resultado = validaciones.validarSegundoNombre(value);
        break;
      case "apellidos":
        resultado = validaciones.validarApellidos(value);
        break;
      case "celular":
        resultado = validaciones.validarCelular(value);
        break;
      case "nro_documento":
        resultado = validaciones.validarDocumento(value);
        break;
      case "correo":
        resultado = validaciones.validarEmail(value);
        break;
      default:
        break;
    }

    return resultado;
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      if (!resultado.valido) {
        setErrores({ ...errores, [name]: resultado.mensaje });
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, foto: files[0] });
      setErrores({ ...errores, [name]: "" });
    } else {
      if (modoEdicion) {
        const resultado = validarCampo(name, value);
        
        if (!resultado.valido) {
          setErrores({ ...errores, [name]: resultado.mensaje });
        } else {
          setErrores({ ...errores, [name]: "" });
        }
      }
      setFormData({ ...formData, [name]: value });
    }
  };
const validarFormulario = () => {
    const nuevosErrores = {};
    let formularioValido = true;

    const camposAValidar = [
      "tipo_documento",
      "nro_documento", 
      "primer_nombre",
      "segundo_nombre",
      "apellidos",
      "fecha_nacimiento",
      "genero",
      "correo",
      "celular"
    ];

    camposAValidar.forEach(campo => {
      const resultado = validarCampo(campo, formData[campo]);
      if (!resultado.valido) {
        nuevosErrores[campo] = resultado.mensaje;
        formularioValido = false;
      }
    });

    if (!formData.tipo_documento) {
      nuevosErrores.tipo_documento = "Debe seleccionar un tipo de documento";
      formularioValido = false;
    }

    if (!formData.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = "La fecha de nacimiento es obligatoria";
      formularioValido = false;
    }

    if (!formData.genero) {
      nuevosErrores.genero = "Debe seleccionar un género";
      formularioValido = false;
    }

    if (formData.foto && typeof formData.foto !== 'string') {
      const resultado = validaciones.validarFoto(formData.foto);
      if (!resultado.valido) {
        nuevosErrores.foto = resultado.mensaje;
        formularioValido = false;
      }
    }

    setErrores(nuevosErrores);
    return formularioValido;
  };



const handleGuardar = async (e) => {
  e.preventDefault();
  
  if (!validarFormulario()) {
    alert("Por favor corrija los errores en el formulario");
    return;
  }

  try {
    const formDataToSend = new FormData();

    // Campos normales
    formDataToSend.append("firstName", formData.primer_nombre);
    formDataToSend.append("secondName", formData.segundo_nombre || "");
    formDataToSend.append("lastNames", formData.apellidos);
    formDataToSend.append("birthDate", formData.fecha_nacimiento);
    formDataToSend.append("gender", mapGender(formData.genero));
    formDataToSend.append("email", formData.correo);
    formDataToSend.append("phone", formData.celular);
    formDataToSend.append("documentNumber", formData.nro_documento);
    formDataToSend.append("documentType", mapDocumentType(formData.tipo_documento));

    // Foto solo si es nueva
    if (formData.foto instanceof File) {
      formDataToSend.append("photoURL", formData.foto);
    }

    const response = await fetch(
      `${API_ENDPOINTS.UPDATE_PERSON}/${formData.nro_documento}`,
      {
        method: "PUT",
        body: formDataToSend, 
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert(result.message || "Persona actualizada exitosamente");

      const personaActualizada = mapPersonFromAPI(result.data);
      setFormData(personaActualizada);
      setDatosOriginales(personaActualizada);
      setModoEdicion(false);
      if (onActualizar) onActualizar();
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Error al actualizar la persona");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con la API");
  }
};


  const handleEliminar = async () => {
    const confirmar = window.confirm('¿Está seguro de eliminar esta persona?');
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_PERSON}/${formData.nro_documento}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Persona eliminada exitosamente');
        if (onActualizar) onActualizar();
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al eliminar la persona');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con la API');
    }
  };

  const handleEditar = () => {
    setModoEdicion(true);
  };

  const handleCancelar = () => {
    setFormData(datosOriginales);
    setErrores({});
    setModoEdicion(false);
  };

  if (cargando) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-center text-blue-900">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {/* Botón cerrar */}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Columna izquierda */}
        <div className="space-y-3 bg-white border border-blue-300 rounded p-4">
          <div>
            <label className="block font-medium text-blue-900">Tipo de documento:</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Cédula">Cédula</option>
              <option value="Tarjeta de identidad">Tarjeta de identidad</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-blue-900">Nro. Documento:</label>
            <input
              type="text"
              name="nro_documento"
              value={formData.nro_documento}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100"
              disabled
              required
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Primer Nombre:</label>
            <input
              type="text"
              name="primer_nombre"
              value={formData.primer_nombre}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Segundo Nombre:</label>
            <input
              type="text"
              name="segundo_nombre"
              value={formData.segundo_nombre}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            />
          </div>

          <hr className="my-4 border-blue-300" />

          <div>
            <label className="block font-medium text-blue-900">Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Género:</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            >
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
              <option value="Prefiero no reportar">Prefiero no reportar</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-blue-900">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Celular:</label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={!modoEdicion}
              required
            />
          </div>
        </div>

        {/* Columna derecha: foto - CENTRADA */}
        <div className="flex flex-col items-center justify-center bg-white border border-blue-300 rounded p-4 h-full">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-300 mb-3 flex items-center justify-center bg-blue-50">
            {formData.foto ? (
              <img
                src={typeof formData.foto === 'string' ? formData.foto : URL.createObjectURL(formData.foto)}
                alt="Foto de persona"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-blue-400 text-sm">Sin foto</span>
            )}
          </div>
          {modoEdicion && (
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="text-sm text-blue-900"
            />
          )}
        </div>

        
      </form>
      {/* Botones de acción */}
        <div className="col-span-1 md:col-span-2 mt-4 flex gap-2">
          {!modoEdicion ? (
            <>
              <button
                type="button"
                onClick={handleEditar}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded transition-colors"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleEliminar}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
              >
                Eliminar
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                onClick={handleGuardar}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
    </div>
  );
};

export default ConsultDoc;