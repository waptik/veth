# Hono Framework on Cloudflare Workers

**_This project is in active development._**

This is the backend server to access TRPC endpoints.

## Getting Started

### Step 1: Install all dependencies

```bash
cd ../.. # Navigate to your project root
pnpm install # Install dependencies in the monorepo
```

### Step 1.1: [Generating/synchronizing Types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

It's recommended to generate types for your Cloudflare Workers environment. This will help with type safety and autocompletion in your IDE.

```bash
pnpm w-hono cf-typegen
```

### Step 2: Local Development

You can run the Hono app locally using Wrangler:

```bash
cd ../.. # Navigate to the root directory if not already there
pnpm dev
```

If Turborepo tui active tab is not on `@repo/hono#dev`, you can switch to the Hono tab using the up/down arrow keys and you should see the following output:

```bash

> @repo/hono@0.0.0 dev /path/to/your/monorepo/apps/hono
> vite --host 0.0.0.0 --port 8787

The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2025-07-12",
but you've requested "2025-07-19". Falling back to "2025-07-12"...

  VITE v7.0.5  ready in 1529 ms

  ➜  Local:   http://localhost:8787/
  ➜  Network: http://192.168.xxx.xxx:8787/
  ➜  Network: http://198.19.xxx.xxx:8787/
  ➜  Network: http://192.168.xxx.xxx:8787/
  ➜  Network: http://100.xxx.xxx:8787/
  ➜  Debug:   http://localhost:8787/__debug
  ➜  press h + enter to show help
```

### Step 3: Deploy your production application to Cloudflare Workers ([Live Demo](https://veth-api.waptik.workers.dev))

If you connected your repository to Cloudflare, automatic deployments will be triggered on every push but fail because of some bug that hasn't been fixed with latest version of Wrangler(after v4.15.2). See [workers-sdk/issue #9309](https://github.com/cloudflare/workers-sdk/issues/9309)

You have to manually deploy using the following command:

```bash
cd ../../ # Navigate to the root directory if not already there
pnpm w-hono run deploy
```

You should see the following output:

```bash
~/path/to/your/monorepo main                                                                                                                                     9m 23s 01:06:34
❯ pnpm w-hono run deploy

> repo@0.0.0 w-hono /path/to/your/monorepo
> pnpm --filter=@repo/hono run deploy


> @repo/hono@0.0.0 deploy /path/to/your/monorepo/apps/hono
> wrangler deploy


 ⛅️ wrangler 4.25.0
───────────────────
Using redirected Wrangler configuration.
 - Configuration being used: "dist/veth_api/wrangler.json"
 - Original user's configuration: "wrangler.jsonc"
 - Deploy configuration file: ".wrangler/deploy/config.json"
Total Upload: 1223.35 KiB / gzip: 333.03 KiB
Worker Startup Time: 42 ms
Uploaded veth-api (8.74 sec)
Deployed veth-api triggers (1.44 sec)
  https://veth-api.[subdomain].workers.dev
Current Version ID: bb1032da-0f52-46ed-b2eb-5bf85cd8fc69

~/path/to/your/monorepo main                                                                                                                                        21s 01:07:14
❯
```

## Contributing

We welcome contributions! Please refer to our [Contributing Guidelines](./CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
