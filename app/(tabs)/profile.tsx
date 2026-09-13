import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { colors, media, spacing } from '../../src/constants/theme';
import { getSavedArticles } from '../../src/lib/bookmarks';
import { supabase } from '../../src/lib/supabase';

export default function Profile() {
  const [savedCount, setSavedCount] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      const [saved, session] = await Promise.all([
        getSavedArticles(),
        supabase?.auth.getSession(),
      ]);
      if (!active) return;
      setSavedCount(saved.length);
      setEmail(session?.data.session?.user.email ?? null);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []));

  const signOut = async () => {
    await supabase?.auth.signOut();
    setEmail(null);
  };

  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><Text style={styles.kicker}>BITBUZZ</Text><Ionicons name="person-circle-outline" size={23} color="#fff" /></View>
    <View style={styles.profile}><Image source={{ uri: media.logo }} style={styles.avatar}/><Text style={styles.name}>{email || 'BitBuzz Reader'}</Text><Text style={styles.role}>{email ? 'Signed in · BitBuzz reader' : 'Student · Explorer'}</Text><Text style={styles.tagline}>More than news.</Text></View>
    <View style={styles.stats}><Stat value={loading ? '—' : String(savedCount)} label="Saved"/><Stat value="—" label="Stories read"/><Stat value="—" label="Opportunities"/></View>
    <View style={styles.menu}>
      <Pressable style={({pressed})=>[styles.row,pressed&&{opacity:.6}]} onPress={()=>router.push('/saved')}><Ionicons name="bookmark-outline" size={19} color="#fff"/><Text style={styles.rowText}>Saved stories</Text><Text style={styles.rowValue}>{savedCount}</Text><Ionicons name="chevron-forward" size={16} color={colors.faint}/></Pressable>
      <Pressable style={({pressed})=>[styles.row,pressed&&{opacity:.6}]}><Ionicons name="notifications-outline" size={19} color="#fff"/><Text style={styles.rowText}>Notifications</Text><Text style={styles.coming}>COMING SOON</Text></Pressable>
      <Pressable style={({pressed})=>[styles.row,pressed&&{opacity:.6}]}><Ionicons name="settings-outline" size={19} color="#fff"/><Text style={styles.rowText}>Settings</Text><Ionicons name="chevron-forward" size={16} color={colors.faint}/></Pressable>
      <Pressable style={({pressed})=>[styles.row,pressed&&{opacity:.6}]}><Ionicons name="help-circle-outline" size={19} color="#fff"/><Text style={styles.rowText}>Help & support</Text><Ionicons name="chevron-forward" size={16} color={colors.faint}/></Pressable>
    </View>
    <View style={styles.account}><Text style={styles.kicker}>ACCOUNT</Text>{email ? <><Text style={styles.accountText}>Signed in with {email}</Text><Pressable onPress={signOut} style={styles.out}><Text style={styles.outText}>SIGN OUT</Text></Pressable></> : <><Text style={styles.accountText}>Connect your BitBuzz account when authentication is enabled on the shared Supabase project.</Text><View style={styles.status}><View style={styles.dot}/><Text style={styles.statusText}>{supabase ? 'Supabase connection configured' : 'Add Supabase environment variables'}</Text></View></>}</View>
    <View style={styles.about}><Text style={styles.kicker}>ABOUT BITBUZZ</Text><Text style={styles.aboutTitle}>Science. Technology. Space. Innovation.</Text><Text style={styles.aboutText}>A student-run newsroom built for people who are curious about what comes next.</Text></View>
  </ScrollView>;
}
function Stat({value,label}:{value:string;label:string}){return <View style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.bg},content:{paddingHorizontal:spacing.page,paddingBottom:60},top:{height:58,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},profile:{alignItems:'center',paddingTop:38},avatar:{width:82,height:82,borderRadius:41,borderWidth:2,borderColor:colors.line},name:{color:'#fff',fontSize:21,fontWeight:'700',letterSpacing:-.6,marginTop:14,maxWidth:330},role:{color:colors.muted,fontSize:12,marginTop:5},tagline:{color:colors.faint,fontSize:11,marginTop:5},stats:{flexDirection:'row',gap:8,marginTop:28},stat:{flex:1,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,borderRadius:17,paddingVertical:15,alignItems:'center'},value:{color:'#fff',fontSize:21,fontWeight:'700'},statLabel:{color:colors.faint,fontSize:8,marginTop:4,textAlign:'center'},menu:{marginTop:22,borderTopWidth:1,borderBottomWidth:1,borderColor:colors.line},row:{minHeight:58,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:colors.line},rowText:{color:'#fff',fontSize:14,flex:1},rowValue:{color:colors.faint,fontSize:11},coming:{color:colors.faint,fontSize:7,fontWeight:'800',letterSpacing:1},account:{marginTop:34,padding:20,borderRadius:20,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line},accountText:{color:colors.muted,fontSize:12,lineHeight:19,marginTop:9},status:{flexDirection:'row',alignItems:'center',gap:7,marginTop:14},dot:{width:7,height:7,borderRadius:4,backgroundColor:colors.green},statusText:{color:colors.faint,fontSize:10},out:{alignSelf:'flex-start',height:40,paddingHorizontal:15,borderRadius:20,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginTop:14},outText:{color:'#000',fontSize:9,fontWeight:'900',letterSpacing:1},about:{marginTop:40,paddingTop:30,borderTopWidth:1,borderTopColor:colors.line},aboutTitle:{color:'#fff',fontSize:25,lineHeight:30,fontWeight:'700',letterSpacing:-.8,marginTop:9},aboutText:{color:colors.muted,fontSize:12,lineHeight:19,marginTop:9}});
