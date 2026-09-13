import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ArticleCard } from '../../src/components/ArticleCard';
import { colors, spacing } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

type Article = { id: string; slug: string; title: string; standfirst?: string | null; cover_image_url?: string | null; published_at?: string | null; categories?: { name: string; slug: string } | null };

export default function Today() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    if (supabase) {
      const { data } = await supabase.from('articles').select('id,slug,title,standfirst,cover_image_url,published_at,categories(name,slug)').eq('status', 'published').order('published_at', { ascending: false }).limit(20);
      setArticles((data || []).map((x: any) => ({ ...x, categories: Array.isArray(x.categories) ? x.categories[0] || null : x.categories })));
    }
    setLoading(false); setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { load(); }, []));
  const hero = articles[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#fff" />}>
      <View style={styles.top}><Text style={styles.wordmark}>bitbuzz</Text><View style={styles.live}><View style={styles.dot} /><Text style={styles.liveText}>NEWSROOM</Text></View></View>
      <View style={styles.intro}><Text style={styles.kicker}>TODAY</Text><Text style={styles.heading}>The world,<Text style={styles.headingMuted}> decoded.</Text></Text><Text style={styles.sub}>Science, technology, space and the ideas shaping tomorrow.</Text></View>
      {loading ? <ActivityIndicator color="#fff" style={{ marginTop: 50 }} /> : !hero ? <View style={styles.empty}><Text style={styles.emptyTitle}>The newsroom is quiet.</Text><Text style={styles.emptyText}>Connect the app to the BitBuzz Supabase project to load published stories.</Text></View> : <>
        <ArticleCard article={hero} featured />
        <Text style={styles.section}>LATEST</Text>
        {articles.slice(1).map(article => <ArticleCard key={article.id} article={article} />)}
      </>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: spacing.page, paddingTop: 64, paddingBottom: 110 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, wordmark: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -1.3 }, live: { flexDirection: 'row', alignItems: 'center', gap: 7 }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent }, liveText: { color: colors.faint, fontSize: 8, fontWeight: '800', letterSpacing: 1.3 },
  intro: { paddingTop: 52, paddingBottom: 32 }, kicker: { color: colors.blue, fontSize: 9, fontWeight: '800', letterSpacing: 2 }, heading: { color: '#fff', fontSize: 43, lineHeight: 45, fontWeight: '700', letterSpacing: -2.2, marginTop: 10 }, headingMuted: { color: 'rgba(255,255,255,.38)' }, sub: { color: colors.muted, fontSize: 14, lineHeight: 21, maxWidth: 340, marginTop: 14 }, section: { color: colors.faint, fontSize: 9, fontWeight: '800', letterSpacing: 2, marginBottom: 18 }, empty: { padding: 24, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '700' }, emptyText: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8 }
});
