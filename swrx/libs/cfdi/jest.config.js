module.exports = {
  name: 'cfdi',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/cfdi',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
