module.exports = {
  name: 'productos',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/productos',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
