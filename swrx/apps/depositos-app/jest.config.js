module.exports = {
  name: 'depositos-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/depositos-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
