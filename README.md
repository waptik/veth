# `Turborepo` Vite starter

This is a community-maintained example. If you experience a problem, please
submit a pull request with a fix. GitHub Issues will be closed.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-vite-react
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `@repo/docs`: a react [vite](https://vitejs.dev) ts app, see [demo](https://veth-docs.vercel.app/)
- `@repo/vite`: another react [vite](https://vitejs.dev) ts app, see [demo](https://veth-site.vercel.app/)
- `@repo/hono`: a [Hono](https://hono.dev) app for Cloudflare Workers, see [demo](https://veth-api.waptik.workers.dev/)
- `@repo/expo`: a React Native app using [Expo](https://expo.dev/)
- `@repo/shared`: a shared package for utilities and types
- `@repo/api`: a package containing tRPC utilities and types
- `@repo/eslint`: shared `eslint` configurations
- `@repo/prettier`: shared `prettier` configurations
- `@repo/tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
