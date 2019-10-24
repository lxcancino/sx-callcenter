module.exports = {
  name: 'depositos',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/depositos',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
