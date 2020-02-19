module.exports = {
  name: 'rastreo',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/rastreo',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
