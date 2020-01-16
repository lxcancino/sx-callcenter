export interface Producto {
  id?: string;
  clave: string;
  descripcion: string;
  unidad: string;
  modoVenta: 'B' | 'N';
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
  imageUrl?: string;
  productoSat?: string;
  unidadSat?: string;
  existencias: Existencia[];
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}

export interface Existencia {
  almacen: string;
  cantidad: number;
  apartados: number;
  disponible: number;
}
