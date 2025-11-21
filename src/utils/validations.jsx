export const validaciones = {
  soloTexto: (valor) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return regex.test(valor);
  },

  soloNumeros: (valor) => {
    const regex = /^[0-9]*$/;
    return regex.test(valor);
  },

  formatoEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  validarPrimerNombre: (valor) => {
    if (!valor) return { valido: false, mensaje: "El primer nombre es obligatorio" };
    if (!validaciones.soloTexto(valor)) return { valido: false, mensaje: "El primer nombre no puede contener números" };
    if (valor.length > 30) return { valido: false, mensaje: "El primer nombre no puede superar 30 caracteres" };
    return { valido: true, mensaje: "" };
  },

  validarSegundoNombre: (valor) => {
    if (valor && !validaciones.soloTexto(valor)) return { valido: false, mensaje: "El segundo nombre no puede contener números" };
    if (valor && valor.length > 30) return { valido: false, mensaje: "El segundo nombre no puede superar 30 caracteres" };
    return { valido: true, mensaje: "" };
  },

  validarApellidos: (valor) => {
    if (!valor) return { valido: false, mensaje: "Los apellidos son obligatorios" };
    if (!validaciones.soloTexto(valor)) return { valido: false, mensaje: "Los apellidos no pueden contener números" };
    if (valor.length > 60) return { valido: false, mensaje: "Los apellidos no pueden superar 60 caracteres" };
    return { valido: true, mensaje: "" };
  },

  validarCelular: (valor) => {
    if (!valor) return { valido: false, mensaje: "El celular es obligatorio" };
    if (!validaciones.soloNumeros(valor)) return { valido: false, mensaje: "El celular solo puede contener números" };
    if (valor.length !== 10) return { valido: false, mensaje: "El celular debe tener exactamente 10 dígitos" };
    return { valido: true, mensaje: "" };
  },

  validarDocumento: (valor) => {
    if (!valor) return { valido: false, mensaje: "El documento es obligatorio" };
    if (!validaciones.soloNumeros(valor)) return { valido: false, mensaje: "El documento solo puede contener números" };
    if (valor.length > 10) return { valido: false, mensaje: "El documento no puede superar 10 dígitos" };
    return { valido: true, mensaje: "" };
  },

  validarEmail: (valor) => {
    if (!valor) return { valido: false, mensaje: "El correo electrónico es obligatorio" };
    if (!validaciones.formatoEmail(valor)) return { valido: false, mensaje: "El formato del correo electrónico no es válido" };
    return { valido: true, mensaje: "" };
  },

  validarFoto: (archivo) => {
    if (!archivo) return { valido: true, mensaje: "" }; 
    const maxSize = 2 * 1024 * 1024; // 
    if (archivo.size > maxSize) return { valido: false, mensaje: "La foto no puede superar los 2 MB" };
    return { valido: true, mensaje: "" };
  }
};