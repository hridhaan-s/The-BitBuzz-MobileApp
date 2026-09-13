import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

export default function Article() {
  const { slug } = useLocalSearchParams<{slug:string}>(); const [article,setArticle]=useState<any>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{if(supabase&&slug){const {data}=await supabase.from('articles').select('id,slug,title,standfirst,body_md,cover_image_url,cover_alt,read_minutes,published_at,categories(name,slug),profiles(display_name)').eq('slug',slug).eq('status','published').maybeSingle();setArticle(data)}setLoading(false)})()},[slug]);
  if(loading)return <View style={styles.loading}><ActivityIndicator color="#fff"/></View>;
  if(!article)return <View style={styles.loading}><Text style={styles.notFound}>Story not found.</Text><Pressable onPress={()=>router.back()}><Text style={styles.backText}>Go back</Text></Pressable></View>;
  const body=String(article.body_md||'').replace(/^#{1,6}\s/gm,'').replace(/\*\*/g,'').replace(/\*/g,'');
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><Pressable onPress={()=>router.back()} style={styles.back}><Ionicons name="chevron-back" size={20} color="#fff"/><Text style={styles.backLabel}>Back</Text></Pressable>{article.cover_image_url&&<Image source={{uri:article.cover_image_url}} accessibilityLabel={article.cover_alt||article.title} style={styles.image}/>}<Text style={styles.category}>{article.categories?.name||'BITBUZZ'}</Text><Text style={styles.title}>{article.title}</Text>{article.standfirst&&<Text style={styles.standfirst}>{article.standfirst}</Text>}<View style={styles.meta}><Text style={styles.metaText}>{article.profiles?.display_name||'BitBuzz'}</Text><Text style={styles.metaText}>•</Text><Text style={styles.metaText}>{article.read_minutes||'—'} min read</Text></View><Text style={styles.body}>{body}</Text></ScrollView>
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#000'},content:{padding:spacing.page,paddingTop:58,paddingBottom:90},loading:{flex:1,backgroundColor:'#000',alignItems:'center',justifyContent:'center'},notFound:{color:'#fff',fontSize:20,fontWeight:'700'},backText:{color:colors.blue,marginTop:12},back:{flexDirection:'row',alignItems:'center',gap:3,marginBottom:24},backLabel:{color:'#fff',fontSize:13},image:{width:'100%',height:240,borderRadius:24,backgroundColor:colors.surface2,marginBottom:22},category:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:1.8},title:{color:'#fff',fontSize:38,lineHeight:41,fontWeight:'700',letterSpacing:-1.8,marginTop:9},standfirst:{color:colors.muted,fontSize:16,lineHeight:24,marginTop:14},meta:{flexDirection:'row',gap:9,marginTop:18,paddingBottom:22,borderBottomWidth:1,borderBottomColor:colors.line},metaText:{color:colors.faint,fontSize:10},body:{color:'rgba(255,255,255,.78)',fontSize:16,lineHeight:28,marginTop:24}}
);
