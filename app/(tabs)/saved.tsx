import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../src/constants/theme';
import { getSavedArticles, SavedArticle } from '../../src/lib/bookmarks';

export default function Saved() {
  const [saved, setSaved] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    getSavedArticles().then((items) => {
      if (active) {
        setSaved(items);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.top}><Text style={styles.kicker}>YOUR LIBRARY</Text><Ionicons name="bookmark" size={20} color="#fff" /></View>
      <Text style={styles.heading}>Saved.</Text>
      <Text style={styles.sub}>Stories worth coming back to.</Text>
      <View style={styles.segment}><View style={styles.active}><Text style={styles.activeText}>ARTICLES</Text></View><View style={styles.inactive}><Text style={styles.segmentText}>{saved.length} SAVED</Text></View></View>

      {loading ? <ActivityIndicator color="#fff" style={{ marginTop: 60 }} /> : saved.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><Ionicons name="bookmark-outline" size={25} color="#fff" /></View>
          <Text style={styles.emptyTitle}>Nothing saved yet.</Text>
          <Text style={styles.emptyText}>Tap the bookmark on any BitBuzz story and it will stay here for later.</Text>
          <Pressable onPress={() => router.push('/')} style={styles.browse}><Text style={styles.browseText}>BROWSE STORIES</Text><Ionicons name="arrow-forward" size={15} color="#000" /></Pressable>
        </View>
      ) : saved.map((item) => (
        <Pressable key={item.id} style={({ pressed }) => [styles.card, pressed && { opacity: 0.72 }]} onPress={() => router.push(`/article/${item.slug}`)}>
          {item.cover_image_url ? <Image source={{ uri: item.cover_image_url }} style={styles.image} /> : <View style={[styles.image, styles.imageFallback]}><Ionicons name="newspaper-outline" size={22} color={colors.faint} /></View>}
          <View style={styles.copy}><Text style={styles.category}>{item.categories?.name || 'BITBUZZ'}</Text><Text style={styles.title}>{item.title}</Text><Text style={styles.meta}>Saved to your library</Text></View>
          <Ionicons name="chevron-forward" size={17} color={colors.faint} />
        </Pressable>
      ))}

      <View style={styles.quote}><Text style={styles.quoteText}>“Curiosity today. A better tomorrow.”</Text><Text style={styles.quoteBy}>— BITBUZZ</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, content: { paddingHorizontal: spacing.page, paddingBottom: 60 },
  top: { height: 58, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.blue, fontSize: 9, fontWeight: '800', letterSpacing: 2 }, heading: { color: '#fff', fontSize: 46, fontWeight: '700', letterSpacing: -2.2, marginTop: 42 },
  sub: { color: colors.muted, fontSize: 14, marginTop: 8 }, segment: { height: 48, borderRadius: 15, backgroundColor: colors.surface2, marginTop: 28, padding: 4, flexDirection: 'row' },
  active: { flex: 1, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, activeText: { color: '#000', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 }, inactive: { flex: 1, alignItems: 'center', justifyContent: 'center' }, segmentText: { color: colors.faint, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  empty: { marginTop: 32, padding: 24, borderRadius: 24, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center' }, emptyIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 16 }, emptyText: { color: colors.muted, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 8 },
  browse: { height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 }, browseText: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  card: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 12 }, image: { width: 82, height: 82, borderRadius: 16 }, imageFallback: { backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1 }, category: { color: colors.blue, fontSize: 8, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#fff', fontSize: 15, lineHeight: 19, fontWeight: '700', marginTop: 5 }, meta: { color: colors.faint, fontSize: 9, marginTop: 7 },
  quote: { marginTop: 42, padding: 22, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: 'center' }, quoteText: { color: '#fff', fontSize: 15, fontStyle: 'italic', textAlign: 'center' }, quoteBy: { color: colors.faint, fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginTop: 10 }
});
