import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArticleCard } from '../../src/components/ArticleCard';
import { SiteHeader } from '../../src/components/SiteHeader';
import { colors, media, spacing } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

type Article = { id: string; slug: string; title: string; standfirst?: string | null; cover_image_url?: string | null; published_at?: string | null; categories?: { name: string; slug: string } | null };
const genres = [
  { label: 'SPACE', image: media.space, icon: 'planet-outline' },
  { label: 'TECH', image: media.tech, icon: 'hardware-chip-outline' },
  { label: 'CYBERSECURITY', image: media.cyber, icon: 'shield-checkmark-outline' },
  { label: 'AVIATION', image: media.aviation, icon: 'airplane-outline' },
  { label: 'INNOVATION', image: media.innovation, icon: 'bulb-outline' },
] as const;

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
      <SiteHeader onSearch={() => router.push('/explore')} onMenu={() => router.push('/profile')} />

      <View style={styles.statusRow}>
        <View style={styles.live}><View style={styles.dot} /><Text style={styles.statusText}>LIVE FROM THE NEWSROOM</Text></View>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()}</Text>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>BITBUZZ · TODAY</Text>
        <Text style={styles.title}>Stay curious.</Text>
        <Text style={styles.subtitle}>Science, technology, space and the ideas shaping tomorrow — without the noise.</Text>
      </View>

      {loading ? <ActivityIndicator color="#fff" style={{ marginTop: 35 }} /> : !hero ? (
        <View style={styles.empty}><Ionicons name="radio-outline" size={24} color={colors.faint} /><Text style={styles.emptyTitle}>The newsroom is quiet.</Text><Text style={styles.emptyText}>Connect the BitBuzz Supabase project to load the latest stories.</Text></View>
      ) : (
        <>
          <Pressable onPress={() => router.push(`/article/${hero.slug}`)} style={({ pressed }) => [styles.feature, pressed && { opacity: .9 }]}>
            {hero.cover_image_url ? <Image source={{ uri: hero.cover_image_url }} style={styles.featureImage} /> : <View style={styles.featureImage} />}
            <View style={styles.featureShade} />
            <View style={styles.featureCopy}>
              <Text style={styles.featureCat}>{hero.categories?.name || 'BITBUZZ'}</Text>
              <Text style={styles.featureTitle}>{hero.title}</Text>
              {hero.standfirst && <Text style={styles.featureSub} numberOfLines={3}>{hero.standfirst}</Text>}
              <View style={styles.read}><Text style={styles.readText}>READ STORY</Text><Ionicons name="arrow-forward" size={15} color="#000" /></View>
            </View>
          </Pressable>

          <View style={styles.sectionHead}><View><Text style={styles.eyebrow}>LATEST</Text><Text style={styles.sectionTitle}>What matters now.</Text></View><Text style={styles.count}>{articles.length} STORIES</Text></View>
          {articles.slice(1).map(article => <ArticleCard key={article.id} article={article} />)}
        </>
      )}

      <View style={styles.worlds}>
        <Text style={styles.eyebrow}>EXPLORE BITBUZZ</Text>
        <Text style={styles.sectionTitle}>Choose your world.</Text>
        <Text style={styles.worldSub}>Five beats. One curious mind.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genreRow}>
          {genres.map((g) => <Pressable key={g.label} onPress={() => router.push({ pathname: '/explore', params: { q: g.label } })} style={({ pressed }) => [styles.genre, pressed && { transform: [{ scale: .98 }], opacity: .82 }]}>
            <Image source={{ uri: g.image }} style={styles.genreImage} /><View style={styles.genreShade} /><View style={styles.genreBottom}><Ionicons name={g.icon} size={18} color="#fff" /><Text style={styles.genreText}>{g.label}</Text><Ionicons name="arrow-up-right-box" size={16} color="#fff" /></View>
          </Pressable>)}
        </ScrollView>
      </View>

      <View style={styles.more}>
        <Text style={styles.eyebrow}>MORE THAN NEWS</Text>
        <Text style={styles.sectionTitle}>Built for the curious.</Text>
        <Text style={styles.body}>Stories, opportunities and useful tools for students who want to understand what is happening — and build what comes next.</Text>
        <View style={styles.toolGrid}>
          <Tool icon="flag-outline" title="Flag It" text="Report suspicious content." />
          <Tool icon="sparkles-outline" title="Chanakya AI" text="Student-focused AI tools." />
          <Tool icon="construct-outline" title="Tool Box" text="Useful tools for building." />
          <Tool icon="paper-plane-outline" title="Submit" text="Send a story to BitBuzz." />
        </View>
      </View>

      <View style={styles.footer}><Image source={{ uri: media.logo }} style={styles.footerLogo} /><Text style={styles.footerBrand}>BitBuzz</Text><Text style={styles.footerSub}>Science. Technology. Space. Innovation.</Text><View style={styles.footerLine} /><Text style={styles.footerFine}>Built by students, for students.</Text></View>
    </ScrollView>
  );
}

function Tool({ icon, title, text }: { icon: any; title: string; text: string }) {
  return <View style={styles.tool}><Ionicons name={icon} size={19} color="#fff" /><Text style={styles.toolTitle}>{title}</Text><Text style={styles.toolText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: spacing.page, paddingBottom: 70 },
  statusRow: { height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line }, live: { flexDirection: 'row', alignItems: 'center', gap: 7 }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green }, statusText: { color: colors.faint, fontSize: 8, fontWeight: '800', letterSpacing: 1.3 }, date: { color: colors.faint, fontSize: 8, fontWeight: '700' },
  intro: { paddingTop: 36, paddingBottom: 25 }, eyebrow: { color: colors.blue, fontSize: 9, fontWeight: '800', letterSpacing: 1.9 }, title: { color: '#fff', fontSize: 48, lineHeight: 50, fontWeight: '800', letterSpacing: -2.7, marginTop: 8 }, subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 11, maxWidth: 350 },
  feature: { height: 455, borderRadius: 28, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, featureImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' }, featureShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.48)' }, featureCopy: { flex: 1, justifyContent: 'flex-end', padding: 23 }, featureCat: { color: 'rgba(255,255,255,.72)', fontSize: 8, fontWeight: '900', letterSpacing: 1.8 }, featureTitle: { color: '#fff', fontSize: 31, lineHeight: 34, fontWeight: '800', letterSpacing: -1.4, marginTop: 8 }, featureSub: { color: 'rgba(255,255,255,.72)', fontSize: 13, lineHeight: 19, marginTop: 9 }, read: { alignSelf: 'flex-start', marginTop: 16, height: 42, paddingHorizontal: 15, borderRadius: 21, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 8 }, readText: { color: '#000', fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  sectionHead: { marginTop: 42, marginBottom: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }, sectionTitle: { color: '#fff', fontSize: 28, lineHeight: 32, fontWeight: '700', letterSpacing: -1.1, marginTop: 7 }, count: { color: colors.faint, fontSize: 8, fontWeight: '800', letterSpacing: 1 }, empty: { padding: 24, borderRadius: 22, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }, emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 11 }, emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  worlds: { marginTop: 48, paddingTop: 32, borderTopWidth: 1, borderTopColor: colors.line }, worldSub: { color: colors.faint, fontSize: 12, marginTop: 7 }, genreRow: { gap: 11, paddingTop: 18 }, genre: { width: 188, height: 142, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.surface }, genreImage: { width: '100%', height: '100%' }, genreShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.34)' }, genreBottom: { position: 'absolute', left: 14, right: 14, bottom: 13, flexDirection: 'row', alignItems: 'center', gap: 8 }, genreText: { flex: 1, color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  more: { marginTop: 48, paddingTop: 32, borderTopWidth: 1, borderTopColor: colors.line }, body: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 13 }, toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 }, tool: { width: '48%', minHeight: 125, padding: 15, borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface }, toolTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 12 }, toolText: { color: colors.faint, fontSize: 10, lineHeight: 15, marginTop: 5 },
  footer: { marginTop: 50, paddingTop: 28, borderTopWidth: 1, borderTopColor: colors.line }, footerLogo: { width: 34, height: 34, borderRadius: 17 }, footerBrand: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -1.3, marginTop: 10 }, footerSub: { color: colors.faint, fontSize: 10, marginTop: 5 }, footerLine: { height: 1, backgroundColor: colors.line, marginVertical: 20 }, footerFine: { color: 'rgba(255,255,255,.25)', fontSize: 9 }
});
