export interface Pedido {
  id: string | number;
}

export interface PedidoDet {
  id: string | number;
  clave: string;
  descripcion: string;
  producto: {
    id: string;
    clave: string;
    descripcion: string;
    imageUrl: string;
  };
  unidad: string;
  presentacion?: string;
  // Importes
  cantidad: number;
  precio: number;
  importe: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  // Tasas
  descuento: number; // %
  impuestoTasa: number;
  // Valores historicos
  precioLista: number;
  precioOriginal: number;
  precioCredito: number;
  precioContado: number;
  descuentoOriginal: number; // % Calculado por el sistema
  gramos: number;
  kilos: number;
  nacional: true;
  comentario?: string;
  importeCortes?: number;
  corte?: Partial<InstruccionDeCorte>;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export interface InstruccionDeCorte {
  id?: string | number;
  largo: number;
  ancho: number;
  tipo: string;
  cantidad: number;
  instruccion?: string;
  refinado: boolean;
  seleccionCalculo: null;
  precio: number;
  instruccionEmpacado?: string;
}
