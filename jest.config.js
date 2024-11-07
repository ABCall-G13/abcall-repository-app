module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?|react-redux)/)',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
