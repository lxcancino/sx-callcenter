export interface Cliente {
  id: string | number;
  nombre: string;
  rfc: string;
  credito?: ClienteCredito;
}

export interface ClienteCredito {
  id: string | number;

}