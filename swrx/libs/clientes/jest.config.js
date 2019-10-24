module.exports = {
  name: 'clientes',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/clientes',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
