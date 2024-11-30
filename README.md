# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

# Submission Requirements

## File list

We have too many files to list the contents of each individually, but all you need to know is that each path under `src/routes/` is a page of our website. We have some accompanying code under `src/utils`, and a bunch of configuration files and other files required for SvelteKit around as well.

For more information about the file structure, see https://svelte.dev/docs/kit/routing.

## Steps to run the project

Pre-requisites: node,npm,git

```bash
git clone https://gitlab.com/jath03/dev-legacy-pharmacy
cd dev-legacy-pharmacy
npm install
npm run dev
```
