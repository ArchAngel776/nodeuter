# Nodeuter

Nodeuter is a compact TypeScript backend foundation for Node.js. It is built
around a small source tree, strict type checking, Babel-based compilation, and
modern JavaScript decorators.

## Tooling

- TypeScript for type checking and declaration output
- Babel for JavaScript builds (`.babelrc`)
- Stage 3 decorators via `@babel/plugin-proposal-decorators` (`2023-11`)
- `babel-plugin-typescript-path-aliases` for `tsconfig.json` path aliases
- ESLint YAML config with `typescript-eslint`

## Commands

Run commands with Yarn:

```sh
yarn typecheck
yarn lint
yarn build
yarn dev
```

When using Docker for Node tooling:

```sh
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD:/app" -w /app node:latest corepack yarn build
```
