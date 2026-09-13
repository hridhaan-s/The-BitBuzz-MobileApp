import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

const genres = ['SPACE', 'TECH', 'CYBERSECURITY', 'AVIATION', 'INNOVATION'];
export default function Explore() {
  const [q, setQ] = useState(''); const [results, setResults] = useState<any[]>([]); const [loading, setLoading] = useState(false);
  const search = useCallback(async (term: string) => { if (!supabase || !term.trim()) { setResults([]); return; } setLoading(true); const { data } = await supabase.from('articles').select('id,slug,title,standfirst,cover_image_url,published_at,categories(name,slug)').eq('status','published').or(`title.ilike.%${term.trim()}%,standfirst.ilike.%${term.trim()}%,body_md.ilike.%${term.trim()}%`).order('published_at',{ascending:false}).limit(20); setResults((data||[]).map((x:any)=>({...x,categories:Array.isArray(x.categories)?x.categories[0]||null:x.categories}))); setLoading(false); }, []);
  useEffect(()=>{ const timer=setTimeout(()=>search(q),250); return ()=>clearTimeout(timer); },[q,search]);
  useFocusEffect(useCallback(()=>()=>{},[]));
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.kicker}>EXPLORE</Text><Text style={styles.heading}>Go deeper.</Text><Text style={styles.sub}>Choose a world or search the newsroom.</Text>
    <View style={styles.search}><Ionicons name="search" size={18} color={colors.faint}/><TextInput value={q} onChangeText={setQ} placeholder="Search stories" placeholderTextColor={colors.faint} style={styles.input}/>{q ? <Pressable onPress={()=>setQ('')}><Ionicons name="close-circle" size={18} color={colors.faint}/></Pressable> : null}</View>
    {!q && <><Text style={styles.label}>TOPICS</Text><View style={styles.grid}>{genres.map((g,i)=><Pressable key={g} onPress={()=>setQ(g)} style={({pressed})=>[styles.topic,pressed&&{opacity:.65}]}><Text style={styles.topicNum}>0{i+1}</Text><Text style={styles.topicText}>{g}</Text><Ionicons name="arrow-up-right" size={16} color={colors.faint}/></Pressable>)}</View></>}
    {!!q && <>{loading ? <ActivityIndicator color="#fff" style={{marginTop:30}}/> : <View style={{marginTop:28}}>{results.map(a=><Pressable key={a.id} onPress={()=>router.push(`/article/${a.slug}`)} style={styles.result}><Text style={styles.resultCat}>{a.categories?.name||'BITBUZZ'}</Text><Text style={styles.resultTitle}>{a.title}</Text>{a.standfirst&&<Text style={styles.resultSub} numberOfLines={2}>{a.standfirst}</Text>}</Pressable>)}{!results.length&&<Text style={styles.no}>No published stories found.</Text>}</View>}</>}
  </ScrollView>
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#000'},content:{padding:spacing.page,paddingTop:64,paddingBottom:110},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},heading:{color:'#fff',fontSize:44,lineHeight:46,fontWeight:'700',letterSpacing:-2,marginTop:10},sub:{color:colors.muted,fontSize:14,marginTop:10},search:{height:52,borderRadius:17,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,flexDirection:'row',alignItems:'center',paddingHorizontal:15,marginTop:28,gap:10},input:{flex:1,color:'#fff',fontSize:15},label:{color:colors.faint,fontSize:9,fontWeight:'800',letterSpacing:2,marginTop:34,marginBottom:12},grid:{gap:10},topic:{minHeight:74,borderRadius:20,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,padding:16,flexDirection:'row',alignItems:'center',gap:14},topicNum:{color:colors.faint,fontSize:10,fontWeight:'700'},topicText:{color:'#fff',fontSize:15,fontWeight:'700',flex:1,letterSpacing:.3},result:{paddingVertical:18,borderBottomWidth:1,borderBottomColor:colors.line},resultCat:{color:colors.blue,fontSize:8,fontWeight:'800',letterSpacing:1.5},resultTitle:{color:'#fff',fontSize:21,lineHeight:25,fontWeight:'700',marginTop:6},resultSub:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:6},no:{color:colors.muted,fontSize:14,marginTop:20}}
);
