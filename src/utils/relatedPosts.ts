import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;
type RelatedPostsOptions = {
  maxPosts?: number;
  fallbackToLatest?: boolean;
  matchThreshold?: number;
};

/**
 * Normaliza tags para comparação consistente
 */
function normalizeTags(tagArray: string[] = []): string[] {
  return tagArray.map(tag => typeof tag === 'string' ? tag.trim().toLowerCase() : '');
}

/**
 * Calcula o score de similaridade entre posts baseado em:
 * - Tags em comum
 * - Mesma categoria (opcional)
 * - Proximidade temporal
 */
function calculateSimilarityScore(
  currentPost: Post,
  targetPost: Post,
  options: {
    tagWeight?: number;
    categoryWeight?: number;
    dateWeight?: number;
  } = {}
): number {
  const { tagWeight = 0.6, categoryWeight = 0.3, dateWeight = 0.1 } = options;
  
  // Pontuação por tags
  const currentTags = new Set(normalizeTags(currentPost.data.tags));
  const targetTags = new Set(normalizeTags(targetPost.data.tags));
  const commonTags = [...currentTags].filter(tag => targetTags.has(tag)).length;
  const tagScore = (commonTags / Math.max(currentTags.size, 1)) * tagWeight;

  // Pontuação por categoria (se aplicável)
  let categoryScore = 0;
  if (categoryWeight > 0 && currentPost.data.categorias && targetPost.data.categorias) {
    const currentcategorias = new Set(currentPost.data.categorias.map(c => c.toLowerCase()));
    const targetcategorias = new Set(targetPost.data.categorias.map(c => c.toLowerCase()));
    categoryScore = [...currentcategorias].some(c => targetcategorias.has(c)) 
      ? categoryWeight 
      : 0;
  }

  // Pontuação por data (posts mais recentes ganham pequeno bônus)
  const dateDiff = currentPost.data.pubDate && targetPost.data.pubDate
    ? Math.abs(new Date(currentPost.data.pubDate).getTime() - new Date(targetPost.data.pubDate).getTime())
    : 0;
  const maxDateDiff = 1000 * 60 * 60 * 24 * 365 * 2; // 2 anos
  const normalizedDateDiff = Math.min(dateDiff, maxDateDiff) / maxDateDiff;
  const dateScore = (1 - normalizedDateDiff) * dateWeight;

  return tagScore + categoryScore + dateScore;
}

/**
 * Versão otimizada para SSG (síncrona)
 */
export function getRelatedPosts(
  currentPost: Post,
  allPosts: Post[],
  options: RelatedPostsOptions = {}
): Post[] {
  const {
    maxPosts = 3,
    fallbackToLatest = true,
    matchThreshold = 0.1
  } = options;

  const currentId = currentPost.id;
  const results: Array<{ post: Post; score: number }> = [];

  for (const post of allPosts) {
    // Pula o post atual
    if (post.id === currentId) continue;

    // Calcula score de similaridade
    const score = calculateSimilarityScore(currentPost, post);

    // Só inclui se atingir o threshold mínimo
    if (score >= matchThreshold) {
      results.push({ post, score });
    }
  }

  // Ordena por score (decrescente) e depois por data (decrescente)
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (
      new Date(b.post.data.pubDate).getTime() - 
      new Date(a.post.data.pubDate).getTime()
    );
  });

  // Pega os posts com melhor score
  const bestMatches = results.slice(0, maxPosts).map(item => item.post);

  // Fallback para posts mais recentes se não encontrar matches relevantes
  if (bestMatches.length === 0 && fallbackToLatest) {
    return allPosts
      .filter(post => post.id !== currentId)
      .sort((a, b) => (
        new Date(b.data.pubDate).getTime() - 
        new Date(a.data.pubDate).getTime()
      ))
      .slice(0, maxPosts);
  }

  return bestMatches;
}

/**
 * Função auxiliar para uso em getStaticPaths
 */
export function prepareRelatedPostsData(posts: Post[]) {
  return posts.map(post => ({
    ...post,
    relatedPosts: getRelatedPosts(post, posts)
  }));
}