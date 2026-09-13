import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, media, spacing } from '../../src/constants/theme';

const rows = [['bookmark-outline','Saved stories'],['notifications-outline','Notifications'],['settings-outline','Settings'],['help-circle-outline','Help & support']];

export default function Profile() {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><Text style={styles.kicker}>BITBUZZ</Text><Ionicons name="person-circle-outline" size={23} color="#fff" /></View>
    <View style={styles.profile}><Image source={{uri:media.logo}} style={styles.avatar}/><Text style={styles.name}>BitBuzz Reader</Text><Text style={styles.role}>Student · Explorer</Text><Text style={styles.tagline}>More than news.</Text></View>
    <View style={styles.stats}><Stat value="—" label="Stories read"/><Stat value="—" label="Saved"/><Stat value="—" label="Opportunities"/></View>
    <View style={styles.menu}>{rows.map(([icon,label])=><Pressable key={label} style={({pressed})=>[styles.row,pressed&&{opacity:.6}]}><Ionicons name={icon as any} size={19} color="#fff"/><Text style={styles.rowText}>{label}</Text><Ionicons name="chevron-forward" size={16} color={colors.faint}/></Pressable>)}</View>
    <View style={styles.about}><Text style={styles.kicker}>ABOUT BITBUZZ</Text><Text style={styles.aboutTitle}>Science. Technology. Space. Innovation.</Text><Text style={styles.aboutText}>A student-run newsroom built for people who are curious about what comes next.</Text></View>
  </ScrollView>;
}
function Stat({value,label}:{value:string;label:string}){return <View style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.bg},content:{paddingHorizontal:spacing.page,paddingBottom:60},top:{height:58,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},kicker:{color:colors.blue,fontSize:9,fontWeight:'800',letterSpacing:2},profile:{alignItems:'center',paddingTop:38},avatar:{width:82,height:82,borderRadius:41,borderWidth:2,borderColor:colors.line},name:{color:'#fff',fontSize:23,fontWeight:'700',letterSpacing:-.7,marginTop:14},role:{color:colors.muted,fontSize:12,marginTop:5},tagline:{color:colors.faint,fontSize:11,marginTop:5},stats:{flexDirection:'row',gap:8,marginTop:28},stat:{flex:1,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.line,borderRadius:17,paddingVertical:15,alignItems:'center'},value:{color:'#fff',fontSize:21,fontWeight:'700'},statLabel:{color:colors.faint,fontSize:8,marginTop:4,textAlign:'center'},menu:{marginTop:22,borderTopWidth:1,borderBottomWidth:1,borderColor:colors.line},row:{minHeight:58,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:colors.line},rowText:{color:'#fff',fontSize:14,flex:1},about:{marginTop:40,paddingTop:30,borderTopWidth:1,borderTopColor:colors.line},aboutTitle:{color:'#fff',fontSize:25,lineHeight:30,fontWeight:'700',letterSpacing:-.8,marginTop:9},aboutText:{color:colors.muted,fontSize:12,lineHeight:19,marginTop:9}}
);