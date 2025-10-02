
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

interface DailySummary {
  totalSales: number;
  transactionCount: number;
  target: number;
  achievement: number;
}

interface CashAdvance {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export default function CashierDashboard() {
  const { user, logout } = useAuth();
  const [dailySummary, setDailySummary] = useState<DailySummary>({
    totalSales: 2450000,
    transactionCount: 45,
    target: 3000000,
    achievement: 81.7,
  });
  const [cashAdvances, setCashAdvances] = useState<CashAdvance[]>([
    {
      id: '1',
      amount: 500000,
      status: 'pending',
      date: '2024-01-15',
    },
  ]);
  const [incentiveEnabled, setIncentiveEnabled] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  const navigateToSales = () => {
    router.push('/sales-transaction');
  };

  const navigateToStock = () => {
    router.push('/stock-management');
  };

  const navigateToCashAdvance = () => {
    router.push('/cash-advance');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={[typography.h2, styles.greeting]}>
            Hello, {user?.name}
          </Text>
          <Text style={[typography.bodySecondary, styles.role]}>
            Cashier Dashboard
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <IconSymbol name="power" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Summary */}
        <View style={[commonStyles.card, styles.summaryCard]}>
          <Text style={[typography.h3, styles.cardTitle]}>Today's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[typography.caption, styles.summaryLabel]}>Total Sales</Text>
              <Text style={[typography.h3, { color: colors.primary }]}>
                {formatCurrency(dailySummary.totalSales)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[typography.caption, styles.summaryLabel]}>Transactions</Text>
              <Text style={[typography.h3, { color: colors.secondary }]}>
                {dailySummary.transactionCount}
              </Text>
            </View>
          </View>
          
          {/* Target Progress */}
          <View style={styles.targetSection}>
            <View style={commonStyles.spaceBetween}>
              <Text style={[typography.caption, styles.summaryLabel]}>Daily Target</Text>
              <Text style={[typography.caption, { color: colors.accent }]}>
                {dailySummary.achievement.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(dailySummary.achievement, 100)}%` }
                ]} 
              />
            </View>
            <Text style={[typography.caption, styles.targetText]}>
              {formatCurrency(dailySummary.totalSales)} / {formatCurrency(dailySummary.target)}
            </Text>
          </View>
        </View>

        {/* Cash Advance Notifications */}
        {cashAdvances.length > 0 && (
          <View style={[commonStyles.card, styles.notificationCard]}>
            <View style={commonStyles.spaceBetween}>
              <Text style={[typography.h3, styles.cardTitle]}>Cash Advance</Text>
              <TouchableOpacity onPress={navigateToCashAdvance}>
                <Text style={[typography.caption, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </View>
            {cashAdvances.map((advance) => (
              <View key={advance.id} style={styles.notificationItem}>
                <View style={styles.notificationContent}>
                  <Text style={typography.body}>
                    {formatCurrency(advance.amount)}
                  </Text>
                  <Text style={[typography.caption, styles.notificationDate]}>
                    {advance.date}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: advance.status === 'pending' ? colors.accent : colors.secondary }
                ]}>
                  <Text style={[typography.caption, { color: colors.card }]}>
                    {advance.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Incentive Section */}
        {incentiveEnabled && (
          <View style={[commonStyles.card, styles.incentiveCard]}>
            <View style={commonStyles.row}>
              <IconSymbol name="star.fill" size={24} color={colors.accent} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[typography.h3, styles.cardTitle]}>Incentive Program</Text>
                <Text style={[typography.bodySecondary]}>
                  Achieve 100% target to earn bonus!
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.primary }]}
            onPress={navigateToSales}
          >
            <IconSymbol name="cart.fill" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Sales Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.secondary }]}
            onPress={navigateToStock}
          >
            <IconSymbol name="cube.box.fill" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Stock Management</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.accent }]}
            onPress={navigateToCashAdvance}
          >
            <IconSymbol name="banknote" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Cash Advance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.highlight, borderWidth: 2, borderColor: colors.primary }]}
          >
            <IconSymbol name="person.2.fill" size={32} color={colors.primary} />
            <Text style={[typography.body, { color: colors.primary }]}>Member System</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...commonStyles.spaceBetween,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    marginBottom: 8,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  targetSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  targetText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  notificationCard: {
    marginBottom: 16,
  },
  notificationItem: {
    ...commonStyles.spaceBetween,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationDate: {
    marginTop: 4,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  incentiveCard: {
    marginBottom: 16,
    backgroundColor: colors.highlight,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.card,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
});
