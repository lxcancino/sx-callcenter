import * as moment from 'moment';

const hoy = moment(new Date());
const ayer = hoy.subtract(1, 'days');

export const TRANSFERENCIAS = [
  {
    id: 'X1',
    cuenta: 'SCOTIA 342531',
    banco: 'BANAMEX',
    total: 100.0,
    sucursal: 'CALLCENTER',
    usuario: 'admin',
    transferencia: true,
    creado: moment().toISOString(),
    comentario: undefined
  },
  {
    id: 'X2',
    cuenta: 'SCOTIA 342531',
    banco: 'BANAMEX',
    total: 1000.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas1',
    transferencia: true,
    creado: moment()
      .subtract(1, 'hours')
      .toISOString(),
    comentario: undefined
  },
  {
    id: 'X3',
    cuenta: 'SCOTIA 342531',
    banco: 'BANCOMER',
    total: 1500.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas1',
    transferencia: true,
    creado: moment()
      .subtract(2, 'hours')
      .toISOString(),
    comentario: undefined
  },
  {
    id: 'X4',
    cuenta: 'BANCOMER 55633',
    banco: 'BANAMEX',
    total: 4000.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas4',
    transferencia: true,
    creado: moment()
      .subtract(3, 'hours')
      .toISOString(),
    comentario: undefined
  },
  {
    id: 'X5',
    cuenta: 'SANTANDER XX42',
    banco: 'BANAMEX',
    total: 3000.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas5',
    transferencia: true,
    creado: ayer.toISOString(),
    comentario: undefined
  },
  {
    id: 'X6',
    cuenta: 'SCOTIA 342531',
    banco: 'SANTANDER',
    total: 100.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas1',
    transferencia: true,
    creado: ayer.subtract(3, 'hours').toISOString(),
    comentario: undefined
  },
  {
    id: 'X7',
    cuenta: 'BANAMEX 5255',
    banco: 'SANTANDER',
    total: 7450.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas7',
    transferencia: true,
    creado: ayer.subtract(3, 'hours').toISOString(),
    comentario: undefined
  },
  {
    id: 'X8',
    cuenta: 'SANTANDER X544',
    banco: 'BANAMEx',
    total: 34000.0,
    sucursal: 'CALLCENTER',
    usuario: 'pruebas8',
    transferencia: true,
    creado: ayer.subtract(2, 'hours').toISOString(),
    comentario: undefined
  }
];

export const DATA = [...TRANSFERENCIAS];
