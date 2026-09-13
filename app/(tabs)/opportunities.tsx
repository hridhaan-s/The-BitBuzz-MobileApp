import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { colors, spacing } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

export default function Opportunities() {
  const [items,setItems]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [refreshing,setRefreshing]=useState(false);
  const load=async(refresh=false)=>{if(refresh)setRefreshing(true);else setLoading(true);if(supabase){const {data}=await supabase.from('opportunities').select('*').order('created_at',{ascending:false}).limit(30);setItems(data||[])}setLoading(false);setRefreshing(false)};
  useFocusEffect(useCallback(()=>{load()},[]));
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>load(true)} tintColor="#fff"/>}>
    <Text style={styles.kicker}>OPPORTUNITIES</Text><Text style={styles.heading}>Find your next move.</Text><Text style={styles.sub}>Grants, programs, competitions and things worth applying for.</Text>
    {loading?<ActivityIndicator color="#fff" style={{marginTop:50}}/>:<View style={{marginTop:30}}>{items.map((item,i)=><View key={item.id||i} style={styles.card}><View style={styles.row}><Text style={styles.type}>{item.type||item.category||'OPPORTUNITY'}</Text>{item.deadline&&<Text style={styles.deadline}>{item.deadline}</Text>}</View><Text style={styles.title}>{item.title||item.name}</Text>{(item.description||item.summary)&&<Text style={styles.desc} numberOfLines={3}>{item.description||item.summary}</Text>}</View>)}{!items.length&&<View style={styles.empty}><Text style={styles.emptyTitle}>Nothing new yet.</Text><Text style={styles.desc}>New opportunities will appear here from the BitBuzz newsroom.</Text></View>}</View>}
  </ScrollView>
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#000'},content:{padding:spacing.page,paddingTop:64,paddingBottom:110},kicker:{color:colors.accent,fontSize:9,fontWeight:'800',letterSpacing:2},heading:{color:'#fff',fontSize:40,lineHeight:43,fontWeight:'700',letterSpacing:-1.8,marginTop:10},sub:{color:colors.muted,fontSize:14,lineHeight:21,marginTop:12,maxWidth:340},card:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,borderRadius:22,padding:18,marginBottom:12},row:{flexDirection:'row',justifyContent:'space-between',gap:10},type:{color:colors.blue,fontSize:8,fontWeight:'800',letterSpacing:1.4},deadline:{color:colors.faint,fontSize:9},title:{color:'#fff',fontSize:20,lineHeight:24,fontWeight:'700',marginTop:12},desc:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:7},empty:{padding:22,borderRadius:22,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line},emptyTitle:{color:'#fff',fontSize:20,fontWeight:'700',marginBottom:4}}
);
