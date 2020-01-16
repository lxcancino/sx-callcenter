module.exports = {
  name: 'existencias',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/existencias',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
