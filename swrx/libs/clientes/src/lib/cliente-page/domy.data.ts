export const CLIENTE_DUMMY = {
  id: '402880fc5e4ec411015e4ec7a46701de',
  dateCreated: '2017-09-16T18:24:20Z',
  permiteCheque: true,
  formaDePago: 3,
  clave: 'P010389',
  lastUpdated: '2019-12-13T18:54:55Z',
  vendedor: {
    id: '402880fc5e4ec411015e4ec65360013a'
  },
  rfc: 'PBA0511077F9',
  folioRFC: 1,
  chequeDevuelto: 0,
  direcciones: {
    'GRACIANO S #:3 CP:76030': {
      calle: 'GRACIANO SANCHEZ',
      codigoPostal: '76030',
      colonia: 'CASA BLANCA',
      estado: 'QUERÉTARO',
      latitud: 0,
      longitud: 0,
      municipio: 'QUERETARO',
      numeroExterior: '3',
      pais: 'México'
    }
  },
  activo: true,
  juridico: false,
  sw2: 2029,
  nombre: 'PAPELSA BAJIO SA DE CV',
  direccion: {
    numeroExterior: '3',
    latitud: 0,
    longitud: 0,
    estado: 'QUERÉTARO',
    pais: 'México',
    calle: 'GRACIANO SANCHEZ',
    colonia: 'CASA BLANCA',
    codigoPostal: '76030',
    municipio: 'QUERETARO'
  },
  credito: {
    id: '402880fc5e528d79015e52a2d9d046b0',
    postfechado: false,
    operador: 3,
    saldo: 25000000,
    lineaDeCredito: 25000000,
    plazo: 60,
    atrasoMaximo: 0,
    creditoActivo: true,
    diaRevision: 1,
    sw2: 87,
    diaCobro: 1,
    revision: false,
    venceFactura: true,
    descuentoFijo: 25.3,
    cliente: {
      id: '402880fc5e4ec411015e4ec7a46701de'
    }
  },
  medios: [
    {
      id: '402880fc609e502601609e5925d60135',
      updateUser: '',
      tipo: 'TEL',
      activo: true,
      sw2: 2029,
      descripcion: '01442-215-4512',
      cliente: {
        id: '402880fc5e4ec411015e4ec7a46701de'
      },
      cfdi: false
    },
    {
      id: '402880fc609e502601609e5924fe0133',
      updateUser: '',
      tipo: 'TEL',
      activo: true,
      sw2: 2029,
      descripcion: '01442-215-4510',
      cliente: {
        id: '402880fc5e4ec411015e4ec7a46701de'
      },
      cfdi: false
    },
    {
      id: '402880fc609e502601609e59256a0134',
      updateUser: '',
      tipo: 'TEL',
      activo: true,
      sw2: 2029,
      descripcion: '01442-215-4511',
      cliente: {
        id: '402880fc5e4ec411015e4ec7a46701de'
      },
      cfdi: false
    },
    {
      id: '402880fc609e502601609e5926410136',
      sucursalUpdated: 'TACUBA',
      updateUser: 'gvelazquez',
      tipo: 'MAIL',
      activo: true,
      sw2: 2029,
      descripcion: 'gbarron@papelsa.com.mx',
      validado: true,
      cliente: {
        id: '402880fc5e4ec411015e4ec7a46701de'
      },
      cfdi: true
    },
    {
      id: '402880fc609e502601609e5924900132',
      updateUser: '',
      tipo: 'FAX',
      activo: true,
      sw2: 2029,
      descripcion: '01442-215-4513',
      cliente: {
        id: '402880fc5e4ec411015e4ec7a46701de'
      },
      cfdi: false
    }
  ],
  cfdiMail: 'gbarron@papelsa.com.mx',
  telefonos: ['01442-215-4512', '01442-215-4510', '01442-215-4511']
};
