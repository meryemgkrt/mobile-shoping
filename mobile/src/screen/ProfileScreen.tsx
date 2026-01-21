import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONT_FAMILY } from '../constants';

type MenuItem = {
  id: number;
  title: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
};

const ProfileScreen = () => {
  const user = {
    name: 'Meryem',
    email: 'meryem@example.com',
    avatar: 'https://via.placeholder.com/200',
  };

  const stats = [
    { value: '12', label: 'Sipariş' },
    { value: '45', label: 'Favori' },
    { value: '3', label: 'Adres' },
  ];

  const menuItems: MenuItem[] = [
    { id: 1, title: 'Siparişlerim', icon: 'receipt-outline', onPress: () => {} },
    { id: 2, title: 'Favorilerim', icon: 'heart-outline', onPress: () => {} },
    { id: 3, title: 'Adreslerim', icon: 'location-outline', onPress: () => {} },
    { id: 4, title: 'Ödeme Yöntemlerim', icon: 'card-outline', onPress: () => {} },
    { id: 5, title: 'Bildirimler', icon: 'notifications-outline', onPress: () => {} },
    { id: 6, title: 'Ayarlar', icon: 'settings-outline', onPress: () => {} },
    { id: 7, title: 'Yardım & Destek', icon: 'help-circle-outline', onPress: () => {} },
    { id: 8, title: 'Çıkış Yap', icon: 'log-out-outline', onPress: () => {}, danger: true },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient
          colors={['#FFF5F0', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Profile</Text>

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.9}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primaryBlack} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.9}>
                <Ionicons name="camera" size={16} color={COLORS.primaryWhite} />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>

              <TouchableOpacity style={styles.editBtn} activeOpacity={0.9}>
                <Ionicons name="create-outline" size={16} color={COLORS.primaryOrange} />
                <Text style={styles.editText}>Profili Düzenle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* STATS */}
        <View style={styles.statsCard}>
          {stats.map((s, idx) => (
            <React.Fragment key={s.label}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {idx !== stats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* MENU */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const danger = !!item.danger;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.9}
              >
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconWrap, danger && styles.menuIconWrapDanger]}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={danger ? '#EF4444' : '#6B7280'}
                    />
                  </View>
                  <Text style={[styles.menuText, danger && styles.menuTextDanger]}>
                    {item.title}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#C9CDD3" />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.version}>Versiyon 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primaryWhite,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryWhite,
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerRow: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    letterSpacing: -0.4,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraBtn: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: COLORS.primaryLightGrey,
    marginBottom: 10,
  },
  editBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: COLORS.primaryOrange + '22',
  },
  editText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.poppins_semibold,
    color: COLORS.primaryOrange,
  },

  statsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryOrange,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: COLORS.primaryLightGrey,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#EDEDED',
  },

  menuSection: {
    marginTop: 14,
    marginHorizontal: 16,
    gap: 10,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconWrapDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  menuText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.poppins_medium,
    color: COLORS.primaryBlack,
  },
  menuTextDanger: {
    color: '#EF4444',
  },

  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginVertical: 22,
    fontFamily: FONT_FAMILY.poppins_regular,
  },
});
