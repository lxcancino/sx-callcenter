module.exports = {
  name: 'pedidos',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/pedidos',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
