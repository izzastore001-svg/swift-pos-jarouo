
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const profileOptions = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'person.circle',
      onPress: () => Alert.alert('Coming Soon', 'Account settings will be available soon'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'lock.shield',
      onPress: () => Alert.alert('Coming Soon', 'Security settings will be available soon'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'questionmark.circle',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'info.circle',
      onPress: () => Alert.alert('POS System', 'Version 1.0.0\nBuilt with React Native & Expo'),
    },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <Text style={[typography.h2, styles.title]}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={[commonStyles.card, styles.userCard]}>
          <View style={styles.avatarContainer}>
            <IconSymbol 
              name={user?.role === 'owner' ? 'crown.fill' : 'person.fill'} 
              size={48} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={[typography.h3, styles.userName]}>{user?.name}</Text>
            <Text style={[typography.bodySecondary, styles.userRole]}>
              {user?.role === 'owner' ? 'Owner/Admin' : 'Cashier'}
            </Text>
            {user?.email && (
              <Text style={[typography.caption, styles.userEmail]}>{user.email}</Text>
            )}
          </View>
        </View>

        {/* Role Badge */}
        <View style={[
          styles.roleBadge,
          { backgroundColor: user?.role === 'owner' ? colors.accent : colors.secondary }
        ]}>
          <IconSymbol 
            name={user?.role === 'owner' ? 'crown' : 'person.badge.key'} 
            size={20} 
            color={colors.card} 
          />
          <Text style={[typography.body, styles.roleBadgeText]}>
            {user?.role === 'owner' ? 'Full Access' : 'Cashier Access'}
          </Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[commonStyles.card, styles.optionCard]}
              onPress={option.onPress}
            >
              <View style={commonStyles.row}>
                <View style={styles.optionIcon}>
                  <IconSymbol name={option.icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={[typography.body, styles.optionTitle]}>{option.title}</Text>
                <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton]}
          onPress={handleLogout}
        >
          <IconSymbol name="power" size={24} color={colors.card} />
          <Text style={[typography.body, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[typography.caption, styles.appInfoText]}>
            POS System v1.0.0
          </Text>
          <Text style={[typography.caption, styles.appInfoText]}>
            Built with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    marginBottom: 4,
  },
  userRole: {
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userEmail: {
    color: colors.textSecondary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    gap: 8,
  },
  roleBadgeText: {
    color: colors.card,
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    marginBottom: 8,
    padding: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTitle: {
    flex: 1,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  logoutButtonText: {
    color: colors.card,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  appInfoText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
});
