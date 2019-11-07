module.exports = {
  name: 'form-utils',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/form-utils',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
