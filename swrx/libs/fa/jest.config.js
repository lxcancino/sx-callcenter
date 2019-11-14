module.exports = {
  name: 'fa',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/fa',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
