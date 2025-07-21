# `VETH` (Vite, Expo, TRPC, Hono) starter

**_This project is in active development._**

This is a community-maintained example. If you experience a problem, please
submit a pull request with a fix. GitHub Issues will be closed.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-vite-react
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps, Packages and Utilities

### Apps

- `@repo/docs`: a react [vite](https://vitejs.dev) ts app, see [demo](https://veth-docs.vercel.app/)
- `@repo/vite`: another react [vite](https://vitejs.dev) ts app, see [demo](https://veth-site.vercel.app/)
- `@repo/hono`: a [Hono](https://hono.dev) app for Cloudflare Workers, see [demo](https://veth-api.waptik.workers.dev/)
- `@repo/expo`: a React Native app using [Expo](https://expo.dev/)

### Packages

- `@repo/shared`: a shared package for utilities and types
- `@repo/api`: a package containing tRPC utilities and types

### Utilities

This Turborepo has some additional tools already setup for you:

- `@repo/eslint`: shared [ESLint](https://eslint.org/) configurations for code linting
- `@repo/prettier`: shared [Prettier](https://prettier.io) configurations for code formatting
- `@repo/tsconfig`: [TypeScript](https://www.typescriptlang.org/) configurations for static type checking throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).
