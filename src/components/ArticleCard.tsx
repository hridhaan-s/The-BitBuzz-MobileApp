import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/theme';

type Article = { id: string; slug: string; title: string; standfirst?: string | null; cover_image_url?: string | null; published_at?: string | null; categories?: { name: string; slug: string } | null };

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Pressable onPress={() => router.push(`/article/${article.slug}`)} style={({ pressed }) => [styles.card, featured && styles.featured, pressed && { opacity: 0.78 }]}>
      {article.cover_image_url ? <Image source={{ uri: article.cover_image_url }} style={featured ? styles.heroImage : styles.image} /> : <View style={[featured ? styles.heroImage : styles.image, styles.placeholder]} />}
      <View style={styles.copy}>
        <Text style={styles.category}>{article.categories?.name || 'BITBUZZ'}</Text>
        <Text style={featured ? styles.heroTitle : styles.title}>{article.title}</Text>
        {!!article.standfirst && <Text style={styles.standfirst} numberOfLines={featured ? 3 : 2}>{article.standfirst}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 22 }, featured: { marginBottom: 30 },
  image: { width: 116, height: 116, borderRadius: 18, backgroundColor: colors.surface2, marginBottom: 12 },
  heroImage: { width: '100%', height: 230, borderRadius: 24, backgroundColor: colors.surface2, marginBottom: 16 },
  placeholder: { borderWidth: 1, borderColor: colors.line },
  copy: { gap: 7 },
  category: { color: colors.blue, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 20, lineHeight: 24, fontWeight: '700', letterSpacing: -0.4 },
  heroTitle: { color: colors.text, fontSize: 30, lineHeight: 34, fontWeight: '700', letterSpacing: -1 },
  standfirst: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
