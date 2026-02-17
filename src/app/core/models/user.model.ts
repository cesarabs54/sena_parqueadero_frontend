export interface User {
  id?: string; // UUID
  placa: string;
  tipoVehiculo: 'Moto' | 'Carro';
  tipoDocumento: 'CC' | 'CE' | 'Pasaporte' | 'TI';
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  tipoContrato: 'Funcionario' | 'Contratista' | 'Aprendiz' | 'Otros';
  cargo: string;
  email: string;
  contacto: string;
  estado: 'Activo' | 'Inactivo';
}
