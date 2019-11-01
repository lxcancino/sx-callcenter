module.exports = {
  name: 'core-form-ui',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/core-form-ui',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
