import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../src/constants/theme';
import { SiteHeader } from '../../src/components/SiteHeader';
import { supabase } from '../../src/lib/supabase';

const genres = ['SPACE', 'TECH', 'CYBERSECURITY', 'AVIATION', 'INNOVATION'];

type Result = { id: string; slug: string; title: string; standfirst?: string | null; categories?: { name: string; slug: string } | null };

export default function Explore() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = useState(params.q || '');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const search = useCallback(async (term: string) => {
    const clean = term.trim().replace(/[%,]/g, ' ').replace(/_/g, ' ').replace(/\s+/g, ' ');
    if (!clean) { setResults([]); setError(false); return; }
    if (!supabase) { setResults([]); setError(true); return; }
    setLoading(true); setError(false);
    const pattern = `%${clean}%`;
    const { data, error: queryError } = await supabase.from('articles').select('id,slug,title,standfirst,cover_image_url,published_at,categories(name,slug)').eq('status', 'published').or(`title.ilike.${pattern},standfirst.ilike.${pattern}`).order('published_at', { ascending: false }).limit(20);
    setResults((data || []).map((x: any) => ({ ...x, categories: Array.isArray(x.categories) ? x.categories[0] || null : x.categories })));
    setError(!!queryError);
    setLoading(false);
  }, []);

  useEffect(() => { const timer = setTimeout(() => search(q), 250); return () => clearTimeout(timer); }, [q, search]);

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <SiteHeader onSearch={() => {}} onMenu={() => router.push('/')} />
    <View style={styles.hero}><Text style={styles.kicker}>EXPLORE</Text><Text style={styles.heading}>Go deeper.</Text><Text style={styles.sub}>The same BitBuzz worlds, built for quick discovery on mobile.</Text></View>
    <View style={styles.search}><Ionicons name="search" size={18} color={colors.faint}/><TextInput value={q} onChangeText={setQ} placeholder="Search the newsroom" placeholderTextColor={colors.faint} style={styles.input} returnKeyType="search" autoCapitalize="none" autoCorrect={false}/>{q ? <Pressable onPress={() => setQ('')}><Ionicons name="close-circle" size={18} color={colors.faint}/></Pressable> : null}</View>
    {!q && <><Text style={styles.label}>OUR GENRES</Text><View style={styles.grid}>{genres.map((g, i) => <Pressable key={g} onPress={() => setQ(g)} style={({ pressed }) => [styles.topic, pressed && { opacity: .65 }]}><Text style={styles.topicNum}>0{i + 1}</Text><View style={{ flex: 1 }}><Text style={styles.topicText}>{g}</Text><Text style={styles.topicSub}>Stories & reporting</Text></View><Ionicons name="arrow-up-right" size={16} color={colors.faint}/></Pressable>)}</View></>}
    {!!q && <>{loading ? <ActivityIndicator color="#fff" style={{ marginTop: 30 }} /> : error ? <View style={styles.state}><Ionicons name="cloud-offline-outline" size={24} color={colors.faint}/><Text style={styles.stateTitle}>Search is unavailable.</Text><Text style={styles.stateText}>Check the Supabase connection and try again.</Text></View> : <View style={{ marginTop: 28 }}>{results.map(a => <Pressable key={a.id} onPress={() => router.push(`/article/${a.slug}`)} style={styles.result}><Text style={styles.resultCat}>{a.categories?.name || 'BITBUZZ'}</Text><Text style={styles.resultTitle}>{a.title}</Text>{a.standfirst && <Text style={styles.resultSub} numberOfLines={2}>{a.standfirst}</Text>}</Pressable>)}{!results.length && <View style={styles.state}><Ionicons name="search-outline" size={24} color={colors.faint}/><Text style={styles.stateTitle}>No stories found.</Text><Text style={styles.stateText}>Try a different phrase or choose another BitBuzz genre.</Text></View>}</View>}</>}
    <View style={styles.note}><Text style={styles.noteKicker}>BITBUZZ</Text><Text style={styles.noteTitle}>Curiosity is the starting point.</Text><Text style={styles.noteText}>Space, cybersecurity, technology, aviation and innovation — all in one newsroom.</Text></View>
  </ScrollView>
}

const styles = StyleSheet.create({screen:{flex:1,backgroundColor:'#000'},content:{paddingHorizontal:spacing.page,paddingBottom:60},hero:{paddingTop:44,paddingBottom:22},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},heading:{color:'#fff',fontSize:44,lineHeight:46,fontWeight:'700',letterSpacing:-2,marginTop:10},sub:{color:colors.muted,fontSize:14,lineHeight:21,marginTop:10,maxWidth:350},search:{height:52,borderRadius:17,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',paddingHorizontal:15,marginTop:8,gap:10},input:{flex:1,color:'#fff',fontSize:15},label:{color:colors.faint,fontSize:9,fontWeight:'800',letterSpacing:2,marginTop:34,marginBottom:12},grid:{gap:10},topic:{minHeight:74,borderRadius:20,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:16,flexDirection:'row',alignItems:'center',gap:14},topicNum:{color:colors.faint,fontSize:10,fontWeight:'700'},topicText:{color:'#fff',fontSize:15,fontWeight:'700',letterSpacing:.3},topicSub:{color:colors.faint,fontSize:10,marginTop:4},result:{paddingVertical:18,borderBottomWidth:1,borderBottomColor:colors.line},resultCat:{color:colors.blue,fontSize:8,fontWeight:'800',letterSpacing:1.5},resultTitle:{color:'#fff',fontSize:21,lineHeight:25,fontWeight:'700',marginTop:6},resultSub:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:6},state:{marginTop:26,padding:24,borderRadius:22,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,alignItems:'center'},stateTitle:{color:'#fff',fontSize:17,fontWeight:'700',marginTop:10},stateText:{color:colors.muted,fontSize:12,lineHeight:18,textAlign:'center',marginTop:6},note:{marginTop:46,padding:22,borderRadius:22,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface},noteKicker:{color:colors.accent,fontSize:8,fontWeight:'800',letterSpacing:1.8},noteTitle:{color:'#fff',fontSize:24,lineHeight:28,fontWeight:'700',letterSpacing:-.8,marginTop:8},noteText:{color:colors.muted,fontSize:12,lineHeight:19,marginTop:8}}
);
