## Installation NextJs new version

```bash
npm i create-next-app@latest .
# or
yarn add create-next-app@latest
# or
pnpm add create-next-app@latest
# or
bun add create-next-app@latest
```

## Installation Prettier & Eslint Config Prettier on project NextJs

```bash
npm i -D prettier prettier-plugin-tailwind eslint-config-prettier
# or
yarn add -D prettier prettier-plugin-tailwind eslint-config-prettier
# or
pnpm add -D prettier prettier-plugin-tailwind eslint-config-prettier
# or
bun add -D prettier prettier-plugin-tailwind eslint-config-prettier
```

## eslintrc.json file updated & eslintignore new file

-   eslintrc.json

```json
{
    "extends": ["next/core-web-vitals", "next/typescript", "prettier", "eslint:recommended"],
    "rules": {
        "no-console": "error",
        "semi": "warn",
        "comma-dangle": "off",
        "no-unused-vars": "off",
        "no-unexpected-multiline": "warn",
        "key-spacing": "off",
        "@typescript-eslint/no-unused-vars": "off"
    }
}
```

-   eslintignore

```text
/node_modules
/.next/

/tailwind.config.ts
/tsconfig.json
```

## Prettier File & Prettier Ignore

-   .prettierrc.js

```js
module.exports = {
    arrowParens: 'avoid',
    bracketSameLine: false,
    bracketSpacing: true,
    semi: true,
    singleQuote: true,
    jsxSingleQuote: false,
    trailingComma: 'es5',
    singleAttributePerLine: true,
    printWidth: 120,
    tabWidth: 4,
    plugins: ['prettier-plugin-tailwindcss'],
};
```

-   .prettierignore

```text
/node_modules
.eslintrc.json
```
