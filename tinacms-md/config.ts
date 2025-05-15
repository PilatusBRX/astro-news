import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.TINA_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "src/assets",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "blog",
        label: "Posts",
        path: "src/content/blog",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Data de publicação",
            required: true,
          },
          {
            type: "rich-text",
            name: "description",
            label: "Conteúdo",
            isBody: true,
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Imagem Destacada",            
            description: "Selecione uma imagem para este post",
            required: true,
          },
          {
            type: "string",
            name: "alt",
            label: "Texto alternativo para a imagem",           
            required: true,
          },
          {
            type: "string",
            name: "categories",
            label: "Categorias",
            description: "Adicione uma ou mais categorias para este post",
            list: true, 
            required: false,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            description: "Adicione uma ou mais tags para este post",
            list: true, 
            required: false
          },
        ],
      },
    ],
  },
});