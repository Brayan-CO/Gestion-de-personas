// Mapeo de tipo de documento
export const mapDocumentType = (tipo, toBackend = true) => {
  if (toBackend) {
 
    const mapping = {
      'Cédula': 'Citizen ID',
      'Tarjeta de identidad': 'ID Card',
    };
    return mapping[tipo] || tipo;
  } else {
  
    const mapping = {
      'Citizen ID': 'Cédula',
      'ID Card': 'Tarjeta de identidad',
    };
    return mapping[tipo] || tipo;
  }
};


export const mapGender = (genero, toBackend = true) => {
  if (toBackend) {
  
    const mapping = {
      'Masculino': 'Male',
      'Femenino': 'Female',
      'No binario': 'Non-binary',
      'Prefiero no reportar': 'Prefer not to say',
    };
    return mapping[genero] || genero;
  } else {
 
    const mapping = {
      'Male': 'Masculino',
      'Female': 'Femenino',
      'Non-binary': 'No binario',
      'Prefer not to say': 'Prefiero no reportar',
    };
    return mapping[genero] || genero;
  }
};


export const mapPersonFromAPI = (person) => {
  return {
    id: person.id,
    primer_nombre: person.firstName,
    segundo_nombre: person.secondName || '',
    apellidos: person.lastNames,
    fecha_nacimiento: person.birthDate,
    genero: mapGender(person.gender, false), 
    correo: person.email,
    celular: person.phone,
    nro_documento: person.documentNumber,
    tipo_documento: mapDocumentType(person.documentType, false), 
    foto: person.photo || null
  };
};


export const mapPersonToAPI = (person) => {
  return {
    firstName: person.primer_nombre,
    secondName: person.segundo_nombre || '',
    lastNames: person.apellidos,
    birthDate: person.fecha_nacimiento,
    gender: mapGender(person.genero, true), 
    email: person.correo,
    phone: person.celular,
    documentNumber: person.nro_documento,
    documentType: mapDocumentType(person.tipo_documento, true), 
    photo: person.foto
  };
};