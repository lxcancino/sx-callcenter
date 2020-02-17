export function getEnvioDisplayName(tipo: string): string {
  switch (tipo) {
    case 'ENVIO':
      return 'ENVIO';
      break;
    case 'FORANEO':
      return 'FORANEO DOMICILIO';
    case 'OCURRE':
      return 'FORANEO OCURRE';
    case 'ENVIO_CARGO':
      return 'ENVIO CARGO';
    default:
      return tipo;
  }
}
