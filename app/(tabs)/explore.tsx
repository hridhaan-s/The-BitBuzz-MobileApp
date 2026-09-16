import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, media, spacing } from '../../src/constants/theme';
import { SiteHeader } from '../../src/components/SiteHeader';
import { supabase } from '../../src/lib/supabase';

const genres = [
  { name: 'SPACE', image: media.space, icon: 'planet-outline' },
  { name: 'TECH', image: media.tech, icon: 'hardware-chip-outline' },
  { name: 'CYBERSECURITY', image: media.cyber, icon: 'shield-checkmark-outline' },
  { name: 'AVIATION', image: media.aviation, icon: 'airplane-outline' },
  { name: 'INNOVATION', image: media.innovation, icon: 'bulb-outline' },
] as const;

type Result = { id: string; slug: string; title: string; standfirst?: string | null; cover_image_url?: string | null; categories?: { name: string; slug: string } | null };

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
    <View style={styles.hero}><Text style={styles.kicker}>EXPLORE</Text><Text style={styles.heading}>Go deeper.</Text><Text style={styles.sub}>Find the stories, ideas and discoveries behind the headlines.</Text></View>
    <View style={styles.search}><Ionicons name="search" size={18} color={colors.faint}/><TextInput value={q} onChangeText={setQ} placeholder="Search the newsroom" placeholderTextColor={colors.faint} style={styles.input} returnKeyType="search" autoCapitalize="none" autoCorrect={false}/>{q ? <Pressable onPress={() => setQ('')}><Ionicons name="close-circle" size={18} color={colors.faint}/></Pressable> : null}</View>
    {!q && <><Text style={styles.label}>THE FIVE WORLDS</Text><View style={styles.grid}>{genres.map((g, i) => <Pressable key={g.name} onPress={() => setQ(g.name)} style={({ pressed }) => [styles.topic, pressed && { opacity: .7 }]}><Image source={{ uri: g.image }} style={styles.topicImage}/><View style={styles.topicShade}/><View style={styles.topicCopy}><View style={styles.topicTop}><Text style={styles.topicNum}>0{i + 1}</Text><Ionicons name={g.icon} size={17} color="#fff"/></View><Text style={styles.topicText}>{g.name}</Text><Text style={styles.topicSub}>Stories & reporting</Text></View><Ionicons name="arrow-up-right-box" size={17} color="#fff" style={styles.topicArrow}/></Pressable>)}</View></>}
    {!!q && <>{loading ? <ActivityIndicator color="#fff" style={{ marginTop: 30 }} /> : error ? <View style={styles.state}><Ionicons name="cloud-offline-outline" size={24} color={colors.faint}/><Text style={styles.stateTitle}>Search is unavailable.</Text><Text style={styles.stateText}>Check the Supabase connection and try again.</Text></View> : <View style={{ marginTop: 28 }}>{results.map(a => <Pressable key={a.id} onPress={() => router.push(`/article/${a.slug}`)} style={styles.result}>{a.cover_image_url && <Image source={{ uri: a.cover_image_url }} style={styles.resultImage}/>}<View style={{ flex: 1 }}><Text style={styles.resultCat}>{a.categories?.name || 'BITBUZZ'}</Text><Text style={styles.resultTitle}>{a.title}</Text>{a.standfirst && <Text style={styles.resultSub} numberOfLines={2}>{a.standfirst}</Text>}</View><Ionicons name="chevron-forward" size={17} color={colors.faint}/></Pressable>)}{!results.length && <View style={styles.state}><Ionicons name="search-outline" size={24} color={colors.faint}/><Text style={styles.stateTitle}>No stories found.</Text><Text style={styles.stateText}>Try another phrase or genre.</Text></View>}</View>}</>}
    <View style={styles.note}><Text style={styles.noteKicker}>BITBUZZ</Text><Text style={styles.noteTitle}>Curiosity is the starting point.</Text><Text style={styles.noteText}>Five worlds. One newsroom. Built for students who want to understand more.</Text></View>
  </ScrollView>
}

const styles = StyleSheet.create({screen:{flex:1,backgroundColor:'#000'},content:{paddingHorizontal:spacing.page,paddingBottom:70},hero:{paddingTop:34,paddingBottom:22},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},heading:{color:'#fff',fontSize:44,lineHeight:46,fontWeight:'700',letterSpacing:-2,marginTop:10},sub:{color:colors.muted,fontSize:14,lineHeight:21,marginTop:10,maxWidth:350},search:{height:52,borderRadius:17,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',paddingHorizontal:15,marginTop:8,gap:10},input:{flex:1,color:'#fff',fontSize:15},label:{color:colors.faint,fontSize:9,fontWeight:'800',letterSpacing:2,marginTop:34,marginBottom:12},grid:{gap:11},topic:{height:128,borderRadius:22,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,overflow:'hidden'},topicImage:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},topicShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.42)'},topicCopy:{padding:15},topicTop:{flexDirection:'row',justifyContent:'space-between'},topicNum:{color:'rgba(255,255,255,.58)',fontSize:9,fontWeight:'800'},topicText:{color:'#fff',fontSize:21,fontWeight:'800',letterSpacing:-.5,marginTop:27},topicSub:{color:'rgba(255,255,255,.62)',fontSize:10,marginTop:3},topicArrow:{position:'absolute',right:15,bottom:15},result:{paddingVertical:15,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row',gap:13,alignItems:'center'},resultImage:{width:86,height:78,borderRadius:15,backgroundColor:colors.surface2},resultCat:{color:colors.blue,fontSize:8,fontWeight:'800',letterSpacing:1.5},resultTitle:{color:'#fff',fontSize:18,lineHeight:22,fontWeight:'700',marginTop:5},resultSub:{color:colors.muted,fontSize:11,lineHeight:17,marginTop:5},state:{marginTop:26,padding:24,borderRadius:22,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,alignItems:'center'},stateTitle:{color:'#fff',fontSize:17,fontWeight:'700',marginTop:10},stateText:{color:colors.muted,fontSize:12,lineHeight:18,textAlign:'center',marginTop:6},note:{marginTop:46,padding:22,borderRadius:22,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface},noteKicker:{color:colors.accent,fontSize:8,fontWeight:'800',letterSpacing:1.8},noteTitle:{color:'#fff',fontSize:24,lineHeight:28,fontWeight:'700',letterSpacing:-.8,marginTop:8},noteText:{color:colors.muted,fontSize:12,lineHeight:19,marginTop:8}}
);
