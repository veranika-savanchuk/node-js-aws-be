module.exports = {
    collectCoverage: true,
    transform: {
        '^.+\\.(js)$': 'babel-jest',
    },
    testPathIgnorePatterns: ['node_modules'],
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
};