export const API_ENDPOINTS = {
  // Microservicios de personas
  CREATE_PERSON: 'http://localhost:3001/persons',      // POST
  READ_PERSONS: 'http://localhost:3002/persons',       // GET 
  READ_PERSON: 'http://localhost:3002/persons',        // GET por documento
  UPDATE_PERSON: 'http://localhost:3003/persons',      // PUT
  DELETE_PERSON: 'http://localhost:3004/persons',      // DELETE
  
  // Microservicio de logs
  LOGS: 'http://localhost:3005/logs',                  // GET
  DELETE_LOGS: 'http://localhost:3005/logs',           // DELETE
  
  // MML
  RAG: 'http://localhost:3006/rag',                    // GET
};