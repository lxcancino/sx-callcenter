module.exports = {
  name: 'callcenter',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/callcenter',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
