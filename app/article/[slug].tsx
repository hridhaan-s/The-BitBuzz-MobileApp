import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing } from '../../src/constants/theme';
import { isArticleSaved, toggleSavedArticle } from '../../src/lib/bookmarks';
import { supabase } from '../../src/lib/supabase';

type Block = { type: 'heading' | 'paragraph' | 'quote' | 'spacer'; text?: string };

function parseBody(markdown: string): Block[] {
  return markdown.split(/\n\s*\n/).flatMap((raw) => {
    const text = raw.trim();
    if (!text) return [];
    if (/^#{1,6}\s/.test(text)) return [{ type: 'heading', text: text.replace(/^#{1,6}\s+/, '').replace(/[*_]/g, '') }];
    if (/^>\s/.test(text)) return [{ type: 'quote', text: text.replace(/^>\s+/, '').replace(/[*_]/g, '') }];
    return [{ type: 'paragraph', text: text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1') }];
  });
}

export default function Article() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase || !slug) { setLoading(false); return; }
      const { data } = await supabase.from('articles').select('id,slug,title,standfirst,body_md,cover_image_url,cover_alt,read_minutes,published_at,categories(name,slug),profiles(display_name)').eq('slug', slug).eq('status', 'published').maybeSingle();
      if (!active) return;
      setArticle(data);
      if (data?.id) setSaved(await isArticleSaved(data.id));
      setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  const blocks = useMemo(() => parseBody(String(article?.body_md || '')), [article?.body_md]);

  const onToggleSave = async () => {
    if (!article) return;
    const next = await toggleSavedArticle({ id: article.id, slug: article.slug, title: article.title, standfirst: article.standfirst, cover_image_url: article.cover_image_url, published_at: article.published_at, categories: Array.isArray(article.categories) ? article.categories[0] || null : article.categories });
    setSaved(next);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onShare = async () => {
    if (!article) return;
    await Haptics.selectionAsync();
    await Share.share({ title: article.title, message: `${article.title}\n\nRead it on BitBuzz.` });
  };

  if (loading) return <View style={styles.loading}><ActivityIndicator color="#fff" /></View>;
  if (!article) return <View style={styles.loading}><Text style={styles.notFound}>Story not found.</Text><Pressable onPress={() => router.back()}><Text style={styles.backText}>Go back</Text></Pressable></View>;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.nav}><Pressable onPress={() => router.back()} style={styles.navButton}><Ionicons name="chevron-back" size={20} color="#fff" /><Text style={styles.backLabel}>Back</Text></Pressable><View style={styles.actions}><Pressable onPress={onToggleSave} style={styles.navButton} accessibilityLabel={saved ? 'Remove bookmark' : 'Save article'}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color="#fff" /></Pressable><Pressable onPress={onShare} style={styles.navButton} accessibilityLabel="Share article"><Ionicons name="share-outline" size={20} color="#fff" /></Pressable></View></View>
      {article.cover_image_url && <Image source={{ uri: article.cover_image_url }} accessibilityLabel={article.cover_alt || article.title} style={styles.image} />}
      <Text style={styles.category}>{article.categories?.name || 'BITBUZZ'}</Text>
      <Text style={styles.title}>{article.title}</Text>
      {article.standfirst && <Text style={styles.standfirst}>{article.standfirst}</Text>}
      <View style={styles.meta}><Text style={styles.metaText}>{article.profiles?.display_name || 'BitBuzz'}</Text><Text style={styles.metaText}>•</Text><Text style={styles.metaText}>{article.read_minutes || '—'} min read</Text>{article.published_at && <><Text style={styles.metaText}>•</Text><Text style={styles.metaText}>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text></>}</View>
      <View style={styles.body}>{blocks.map((block, index) => block.type === 'heading' ? <Text key={index} style={styles.bodyHeading}>{block.text}</Text> : block.type === 'quote' ? <View key={index} style={styles.quote}><Text style={styles.quoteText}>{block.text}</Text></View> : <Text key={index} style={styles.bodyText}>{block.text}</Text>)}</View>
      <View style={styles.end}><Ionicons name="sparkles-outline" size={18} color={colors.blue} /><Text style={styles.endText}>You’re caught up.</Text><Text style={styles.endSub}>More stories are waiting in BitBuzz.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' }, content: { padding: spacing.page, paddingTop: 22, paddingBottom: 100 }, loading: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }, notFound: { color: '#fff', fontSize: 20, fontWeight: '700' }, backText: { color: colors.blue, marginTop: 12 },
  nav: { height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, actions: { flexDirection: 'row', gap: 4 }, navButton: { minWidth: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 10 }, backLabel: { color: '#fff', fontSize: 13 },
  image: { width: '100%', height: 250, borderRadius: 24, backgroundColor: colors.surface2, marginBottom: 24 }, category: { color: colors.blue, fontSize: 9, fontWeight: '800', letterSpacing: 1.8 }, title: { color: '#fff', fontSize: 38, lineHeight: 41, fontWeight: '700', letterSpacing: -1.8, marginTop: 9 }, standfirst: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 14 }, meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 18, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: colors.line }, metaText: { color: colors.faint, fontSize: 10 }, body: { marginTop: 24 }, bodyText: { color: 'rgba(255,255,255,.80)', fontSize: 16, lineHeight: 28, marginBottom: 20 }, bodyHeading: { color: '#fff', fontSize: 24, lineHeight: 29, fontWeight: '700', letterSpacing: -.6, marginTop: 12, marginBottom: 12 }, quote: { marginVertical: 8, padding: 18, borderLeftWidth: 2, borderLeftColor: colors.blue, backgroundColor: colors.surface, borderRadius: 4 }, quoteText: { color: '#fff', fontSize: 16, lineHeight: 25, fontStyle: 'italic' }, end: { marginTop: 20, paddingTop: 30, borderTopWidth: 1, borderTopColor: colors.line, alignItems: 'center' }, endText: { color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 10 }, endSub: { color: colors.faint, fontSize: 11, marginTop: 5 }
});
