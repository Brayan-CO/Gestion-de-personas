import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { mapGender, mapDocumentType } from '../utils/personMapper';
import { validaciones } from '../utils/validations';

const PersonDetail = ({ onClose, personaInicial, onActualizar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(personaInicial);
  const [datosOriginales, setDatosOriginales] = useState(personaInicial);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false); 

  useEffect(() => {
    console.log('formData actual:', formData);
    console.log('Tipo documento:', formData.tipo_documento);
    console.log('Género:', formData.genero);
  }, [formData, modoEdicion]);

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
      const archivo = files[0];
      const resultado = validaciones.validarFoto(archivo);
      
      if (!resultado.valido) {
        setErrores({ ...errores, [name]: resultado.mensaje });
        e.target.value = "";
        return;
      }
      
      setFormData({ ...formData, foto: archivo });
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

   const handleEditar = (e) => {
    e.preventDefault(); // Prevenir cualquier comportamiento por defecto
    e.stopPropagation(); // Detener propagación
    console.log('handleEditar llamado'); // Debug
    setModoEdicion(true);
  };

  const handleCancelar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleCancelar llamado'); // Debug
    setFormData(datosOriginales);
    setErrores({});
    setModoEdicion(false);
  };

  const handleGuardar = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!modoEdicion) return;
  if (guardando) return;

  if (!validarFormulario()) {
    alert("Por favor corrija los errores en el formulario");
    return;
  }

  setGuardando(true);

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

    // FOTO (solo si se cambió)
    if (formData.foto instanceof File) {
      formDataToSend.append("photoURL", formData.foto);
    }

    await actualizarPersona(formDataToSend);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar la persona");
    setGuardando(false);
  }
};


  const actualizarPersona = async (formDataToSend) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.UPDATE_PERSON}/${formData.nro_documento}`,
      {
        method: "PUT",
        body: formDataToSend
      }
    );

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Error al actualizar la persona");
      return;
    }

    alert(result.message || "Persona actualizada exitosamente");

    if (result.data) {
      const personaActualizada = {
        id: result.data.id,
        primer_nombre: result.data.firstName,
        segundo_nombre: result.data.secondName || "",
        apellidos: result.data.lastNames,
        fecha_nacimiento: result.data.birthDate,
        genero: mapGender(result.data.gender, false),
        correo: result.data.email,
        celular: result.data.phone,
        nro_documento: result.data.documentNumber,
        tipo_documento: mapDocumentType(result.data.documentType, false),
        foto: result.data.photo || formData.foto || result.data.photoURL || null
      };

      setFormData(personaActualizada);
      setDatosOriginales(personaActualizada);
    }

    setModoEdicion(false);
    if (onActualizar) onActualizar();

  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con la API");
  } finally {
    setGuardando(false);
  }
};

  const handleEliminar = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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

      {/* Formulario - solo onSubmit si está en modo edición */}
      <form 
        onSubmit={handleGuardar} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
      >
        {/* Columna izquierda */}
        <div className="space-y-3 bg-white border border-blue-300 rounded p-4">
          <div>
            <label className="block font-medium text-blue-900">Tipo de documento:</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento || ''}
              onChange={handleChange}
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.tipo_documento ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            >
              <option value="">Seleccione...</option>
              <option value="Cédula">Cédula</option>
              <option value="Tarjeta de identidad">Tarjeta de identidad</option>
            </select>
            {errores.tipo_documento && <p className="text-red-500 text-sm mt-1">{errores.tipo_documento}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Nro. Documento:</label>
            <input
              type="text"
              name="nro_documento"
              value={formData.nro_documento || ''}
              onChange={handleChange}
              maxLength="10"
              className="border border-blue-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100"
              disabled
            />
            {errores.nro_documento && <p className="text-red-500 text-sm mt-1">{errores.nro_documento}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Primer Nombre:</label>
            <input
              type="text"
              name="primer_nombre"
              value={formData.primer_nombre || ''}
              onChange={handleChange}
              maxLength="30"
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.primer_nombre ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            />
            {errores.primer_nombre && <p className="text-red-500 text-sm mt-1">{errores.primer_nombre}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Segundo Nombre:</label>
            <input
              type="text"
              name="segundo_nombre"
              value={formData.segundo_nombre || ''}
              onChange={handleChange}
              maxLength="30"
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.segundo_nombre ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            />
            {errores.segundo_nombre && <p className="text-red-500 text-sm mt-1">{errores.segundo_nombre}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Apellidos:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos || ''}
              onChange={handleChange}
              maxLength="60"
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.apellidos ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            />
            {errores.apellidos && <p className="text-red-500 text-sm mt-1">{errores.apellidos}</p>}
          </div>

          <hr className="my-4 border-blue-300" />

          <div>
            <label className="block font-medium text-blue-900">Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento || ''}
              onChange={handleChange}
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.fecha_nacimiento ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            />
            {errores.fecha_nacimiento && <p className="text-red-500 text-sm mt-1">{errores.fecha_nacimiento}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Género:</label>
            <select
              name="genero"
              value={formData.genero || ''}
              onChange={handleChange}
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.genero ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            >
              <option value="">Seleccione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
              <option value="Prefiero no reportar">Prefiero no reportar</option>
            </select>
            {errores.genero && <p className="text-red-500 text-sm mt-1">{errores.genero}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Correo electrónico:</label>
            <input
              type="email"
              name="correo"
              value={formData.correo || ''}
              onChange={handleChange}
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.correo ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            />
            {errores.correo && <p className="text-red-500 text-sm mt-1">{errores.correo}</p>}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Celular:</label>
            <input
              type="text"
              name="celular"
              value={formData.celular || ''}
              onChange={handleChange}
              maxLength="10"
              className={`border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                errores.celular ? 'border-red-500' : 'border-blue-300'
              }`}
              disabled={!modoEdicion}
            />
            {errores.celular && <p className="text-red-500 text-sm mt-1">{errores.celular}</p>}
          </div>
        </div>

        {/* Columna derecha: foto */}
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
            <>
              <input
                type="file"
                name="foto"
                accept="image/*"
                onChange={handleChange}
                className="text-sm text-blue-900"
              />
              {errores.foto && <p className="text-red-500 text-sm mt-2">{errores.foto}</p>}
              <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 2 MB</p>
            </>
          )}
        </div>

        
      </form>

      
      <div className="mt-4 flex gap-2">
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
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              className={`px-6 py-2 rounded transition-colors text-white ${
                guardando 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={handleCancelar}
              disabled={guardando}
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

export default PersonDetail;