import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArticleCard } from '../../src/components/ArticleCard';
import { SiteHeader } from '../../src/components/SiteHeader';
import { colors, spacing } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

type Article = { id: string; slug: string; title: string; standfirst?: string | null; cover_image_url?: string | null; published_at?: string | null; categories?: { name: string; slug: string } | null };
const genres = ['SPACE', 'CYBERSECURITY', 'TECH', 'AVIATION', 'INNOVATION'];

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
      <SiteHeader onSearch={() => router.push('/explore')} />
      <View style={styles.live}><View style={styles.liveDot}/><Text style={styles.liveText}>BITBUZZ NEWSROOM</Text><Text style={styles.date}>{new Date().toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}).toUpperCase()}</Text></View>
      <View style={styles.intro}><Text style={styles.kicker}>TODAY</Text><Text style={styles.heading}>The world,<Text style={styles.headingMuted}> decoded.</Text></Text><Text style={styles.sub}>Science, technology, space and the ideas shaping tomorrow.</Text></View>
      {loading ? <ActivityIndicator color="#fff" style={{ marginTop: 50 }} /> : !hero ? <View style={styles.empty}><Text style={styles.emptyTitle}>The newsroom is quiet.</Text><Text style={styles.emptyText}>Connect the app to the BitBuzz Supabase project to load published stories.</Text></View> : <>
        <ArticleCard article={hero} featured />
        <View style={styles.sectionHead}><Text style={styles.section}>LATEST</Text><Text style={styles.count}>{articles.length} STORIES</Text></View>
        {articles.slice(1).map(article => <ArticleCard key={article.id} article={article} />)}
      </>}
      <View style={styles.exploreBlock}><Text style={styles.kicker}>EXPLORE BITBUZZ</Text><Text style={styles.blockTitle}>Read what interests you.</Text><View style={styles.genreWrap}>{genres.map((g,i)=><Pressable key={g} onPress={()=>router.push({pathname:'/explore',params:{q:g}})} style={({pressed})=>[styles.genre,pressed&&{opacity:.65}]}><Text style={styles.genreNum}>0{i+1}</Text><Text style={styles.genreText}>{g}</Text><Ionicons name="arrow-up-right" size={15} color={colors.faint}/></Pressable>)}</View></View>
      <View style={styles.mission}><Text style={styles.kicker}>MORE THAN NEWS</Text><Text style={styles.blockTitle}>Built for the curious.</Text><Text style={styles.body}>BitBuzz brings together stories, opportunities and useful tools for students who want to understand what is happening — and build what comes next.</Text><View style={styles.featureRow}><Feature icon="flag-outline" title="Flag It" text="Report suspicious or misleading content."/><Feature icon="sparkles-outline" title="Chanakya AI" text="Explore our student-focused AI tools."/></View><View style={styles.featureRow}><Feature icon="construct-outline" title="Tool Box" text="Useful tools for learning and building."/><Feature icon="paper-plane-outline" title="Submit" text="Have a story? Send it to BitBuzz."/></View></View>
      <View style={styles.footer}><Text style={styles.footerBrand}>BitBuzz</Text><Text style={styles.footerText}>Science. Technology. Space. Innovation.</Text><View style={styles.footerLine}/><Text style={styles.footerFine}>© {new Date().getFullYear()} BitBuzz. Built by students, for students.</Text></View>
    </ScrollView>
  );
}
function Feature({icon,title,text}:{icon:any;title:string;text:string}) { return <View style={styles.feature}><Ionicons name={icon} size={18} color="#fff"/><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureText}>{text}</Text></View>; }
const styles = StyleSheet.create({ screen:{flex:1,backgroundColor:colors.bg},content:{paddingHorizontal:spacing.page,paddingBottom:55},live:{height:36,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderBottomColor:colors.line,gap:7},liveDot:{width:6,height:6,borderRadius:3,backgroundColor:'#65d68a'},liveText:{color:colors.faint,fontSize:8,fontWeight:'800',letterSpacing:1.2},date:{marginLeft:'auto',color:colors.faint,fontSize:8,fontWeight:'700'},intro:{paddingTop:48,paddingBottom:30},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},heading:{color:'#fff',fontSize:43,lineHeight:45,fontWeight:'700',letterSpacing:-2.2,marginTop:10},headingMuted:{color:'rgba(255,255,255,.38)'},sub:{color:colors.muted,fontSize:14,lineHeight:21,maxWidth:340,marginTop:14},sectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:28,marginBottom:17},section:{color:colors.faint,fontSize:9,fontWeight:'800',letterSpacing:2},count:{color:colors.faint,fontSize:8,fontWeight:'700',letterSpacing:1},empty:{padding:24,borderRadius:22,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line},emptyTitle:{color:'#fff',fontSize:20,fontWeight:'700'},emptyText:{color:colors.muted,fontSize:13,lineHeight:20,marginTop:8},exploreBlock:{marginTop:42,paddingTop:34,borderTopWidth:1,borderTopColor:colors.line},blockTitle:{color:'#fff',fontSize:28,lineHeight:32,fontWeight:'700',letterSpacing:-1.1,marginTop:8},genreWrap:{gap:9,marginTop:20},genre:{minHeight:58,borderRadius:17,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:13},genreNum:{color:colors.faint,fontSize:9,fontWeight:'700'},genreText:{color:'#fff',fontSize:13,fontWeight:'700',flex:1,letterSpacing:.3},mission:{marginTop:46,paddingTop:34,borderTopWidth:1,borderTopColor:colors.line},body:{color:colors.muted,fontSize:14,lineHeight:22,marginTop:14},featureRow:{flexDirection:'row',gap:10,marginTop:10},feature:{flex:1,minHeight:130,padding:15,borderRadius:18,borderWidth:1,borderColor:colors.line,backgroundColor:colors.surface},featureTitle:{color:'#fff',fontSize:14,fontWeight:'700',marginTop:12},featureText:{color:colors.faint,fontSize:11,lineHeight:16,marginTop:5},footer:{marginTop:48,paddingTop:30,borderTopWidth:1,borderTopColor:colors.line},footerBrand:{color:'#fff',fontSize:25,fontWeight:'800',letterSpacing:-1.4},footerText:{color:colors.faint,fontSize:11,marginTop:6},footerLine:{height:1,backgroundColor:colors.line,marginVertical:22},footerFine:{color:'rgba(255,255,255,.25)',fontSize:9,lineHeight:15}
});
