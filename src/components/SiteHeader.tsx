import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

const LOGO_URL = 'https://cdn.hackclub.com/019eb6cc-8925-7919-8d68-9add6a3d295f/bitbuzz_kids_logo.jpg';

export function SiteHeader({ onMenu, onSearch }: { onMenu?: () => void; onSearch?: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onMenu} style={styles.iconButton} accessibilityLabel="Open menu">
        <Ionicons name="menu-outline" size={22} color="#fff" />
      </Pressable>
      <View style={styles.brand}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} />
        <Text style={styles.wordmark}>BitBuzz</Text>
      </View>
      <Pressable onPress={onSearch} style={styles.iconButton} accessibilityLabel="Search">
        <Ionicons name="search-outline" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.line },
  wordmark: { color: '#fff', fontSize: 20, fontWeight: '700', letterSpacing: -1 },
});
