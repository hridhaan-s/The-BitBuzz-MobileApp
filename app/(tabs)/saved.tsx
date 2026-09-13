import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, media, spacing } from '../../src/constants/theme';

const saved = [
  { title: 'The new space race is being built by students too', category: 'SPACE', image: media.space },
  { title: 'Your school account is a bigger target than you think', category: 'CYBERSECURITY', image: media.cyber },
  { title: 'AI is getting smaller, faster and much closer to your laptop', category: 'TECH', image: media.tech },
];

export default function Saved() {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><Text style={styles.kicker}>YOUR LIBRARY</Text><Ionicons name="bookmark" size={20} color="#fff" /></View>
    <Text style={styles.heading}>Saved.</Text>
    <Text style={styles.sub}>Stories worth coming back to.</Text>
    <View style={styles.segment}><View style={styles.active}><Text style={styles.activeText}>ARTICLES</Text></View><View><Text style={styles.segmentText}>OPPORTUNITIES</Text></View></View>
    {saved.map((item) => <Pressable key={item.title} style={({pressed})=>[styles.card,pressed&&{opacity:.72}]} onPress={()=>router.push('/explore')}>
      <Image source={{uri:item.image}} style={styles.image}/><View style={styles.copy}><Text style={styles.category}>{item.category}</Text><Text style={styles.title}>{item.title}</Text><Text style={styles.meta}>Saved to your library</Text></View><Ionicons name="chevron-forward" size={17} color={colors.faint}/>
    </Pressable>)}
    <View style={styles.quote}><Text style={styles.quoteText}>“Curiosity today. A better tomorrow.”</Text><Text style={styles.quoteBy}>— BITBUZZ</Text></View>
  </ScrollView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.bg},content:{paddingHorizontal:spacing.page,paddingBottom:60},top:{height:58,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},heading:{color:'#fff',fontSize:46,fontWeight:'700',letterSpacing:-2.2,marginTop:42},sub:{color:colors.muted,fontSize:14,marginTop:8},segment:{height:48,borderRadius:15,backgroundColor:colors.surface2,marginTop:28,padding:4,flexDirection:'row'},active:{flex:1,backgroundColor:'#fff',borderRadius:12,alignItems:'center',justifyContent:'center'},activeText:{color:'#000',fontSize:9,fontWeight:'800',letterSpacing:1.2},segmentText:{color:colors.faint,fontSize:9,fontWeight:'800',letterSpacing:1.2,paddingHorizontal:26,paddingTop:14},card:{paddingVertical:16,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row',alignItems:'center',gap:12},image:{width:82,height:82,borderRadius:16},copy:{flex:1},category:{color:colors.blue,fontSize:8,fontWeight:'800',letterSpacing:1.5},title:{color:'#fff',fontSize:15,lineHeight:19,fontWeight:'700',marginTop:5},meta:{color:colors.faint,fontSize:9,marginTop:7},quote:{marginTop:42,padding:22,borderRadius:22,borderWidth:1,borderColor:colors.line,alignItems:'center'},quoteText:{color:'#fff',fontSize:15,fontStyle:'italic',textAlign:'center'},quoteBy:{color:colors.faint,fontSize:8,fontWeight:'800',letterSpacing:1.5,marginTop:10}}
);