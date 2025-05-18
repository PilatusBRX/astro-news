export interface BlogProps {
    data: {
      title: string;
      author: string;
      tags: string[];
      categories: string[];
      pubDate: Date;
      draft?: boolean;
      description?: string;
      // Adicione outros campos conforme necessário
    };
    url: string;
    // Outros campos do post se existirem
    slug?: string;
    id?: string;
    body?: string;
  }
  
