module.exports = {
  name: 'transportes',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/transportes',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
