module.exports = {
    env: { browser: true, es2020: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    settings: { react: { version: '18.2' } },
    plugins: ['react', 'react-hooks', 'react-refresh'],
    rules: {
        'react-refresh/only-export-components': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prop-types': 0,
        'react/display-name': 0,

        'no-console': 0, // Không console.log() trong dự án
        'no-lonely-if': 1,
        'no-unused-vars': 1, // Khai Báo Biến Mà Không Dùng
        'no-trailing-spaces': 1,
        'no-multi-spaces': 1,
        'no-multiple-empty-lines': 1,
        'space-before-blocks': ['error', 'always'],
        'object-curly-spacing': [1, 'always'],
        indent: ['warn', 4], // Tab Width Mỗi Lần Nhấn Tab
        semi: [0, 'never'], // Dấu ;
        quotes: ['error', 'single'], // Ngoặc "" hay ''
        'array-bracket-spacing': 1, // Thừa Khoảng Trống Trong Array
        'linebreak-style': 0,
        'no-unexpected-multiline': 'warn',
        'keyword-spacing': 1,
        'comma-dangle': 0, // Dấu , cuối cùng trong json object
        'comma-spacing': 1,
        'arrow-spacing': 1,
    },
};
