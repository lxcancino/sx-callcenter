export interface Producto {
  id?: string;
  clave: string;
  descripcion: string;
  unidad: string;
  modoVenta: string;
  codigo: string;
  activo: boolean;
  kilos: number;
  gramos: number;
  calibre: number;
  caras?: number;
  color: string;
  acabado: string;
  presentacion: string;
  nacional: boolean;
  ancho: number;
  largo: number;
  deLinea: boolean;
  precioContado: number;
  precioCredito: number;
  m2XMillar?: number;
  inventariable: boolean;
  linea: string;
  marca: string;
  clase: string;
  productoSat?: string;
  unidadSat?: string;
  existencias: Disponibilidad[];
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}

export interface Disponibilidad {
  almacen: string;
  existencia: number;
  apartados: number;
  disponible: number;
}
