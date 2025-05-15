## npm create astro@latest my-astro-tina-project
cd my-astro-tina-project

## npm install tinacms @tinacms/cli @astrojs/node

## npx tinacms init

## tina/config.ts - arquivo já criado

## astro.config.mjs:
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});


## Configurar os scripts no package.json

"scripts": {
  "dev": "tinacms dev -c \"astro dev\"",
  "build": "tinacms build && astro build",
  "preview": "astro preview"
}

## mkdir -p src/content/posts

## Talvez precise alterar o formato de data no tema:

## A url é http:meu-site.com/admin/index.html

## Para evitar acesso ao /admin em produção, você tem algumas opções:
Opção A: Excluir o diretório admin do build de produção


export default defineConfig({
  // Outras configurações...
  build: {
    excludeAssets: ['admin/**/*'],
  },
});


## Opção B: Adicionar um arquivo de roteamento para seu host
Por exemplo, se estiver usando Netlify, crie um arquivo _redirects:
/admin/* /404 404!