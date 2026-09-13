import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedArticle = {
  id: string;
  slug: string;
  title: string;
  standfirst?: string | null;
  cover_image_url?: string | null;
  published_at?: string | null;
  categories?: { name: string; slug: string } | null;
};

const KEY = '@bitbuzz/saved-articles';

export async function getSavedArticles(): Promise<SavedArticle[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function isArticleSaved(id: string): Promise<boolean> {
  const saved = await getSavedArticles();
  return saved.some((item) => item.id === id);
}

export async function toggleSavedArticle(article: SavedArticle): Promise<boolean> {
  const saved = await getSavedArticles();
  const exists = saved.some((item) => item.id === article.id);
  const next = exists ? saved.filter((item) => item.id !== article.id) : [article, ...saved].slice(0, 100);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return !exists;
}
