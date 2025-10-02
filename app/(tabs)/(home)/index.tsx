
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function HomeScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={[commonStyles.container, commonStyles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  // Route users to their appropriate dashboards based on role
  if (user.role === 'owner') {
    return <Redirect href="/(tabs)/(home)/owner-dashboard" />;
  } else {
    return <Redirect href="/(tabs)/(home)/cashier-dashboard" />;
  }
}
