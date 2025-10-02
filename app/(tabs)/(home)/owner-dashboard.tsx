
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface BusinessStats {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  grossProfit: number;
  totalCustomers: number;
  totalAssets: number;
  topProducts: Array<{ name: string; sales: number }>;
  peakHours: string;
}

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [businessStats] = useState<BusinessStats>({
    dailySales: 2450000,
    weeklySales: 15680000,
    monthlySales: 67500000,
    grossProfit: 18750000,
    totalCustomers: 1250,
    totalAssets: 125000000,
    topProducts: [
      { name: 'Indomie Goreng', sales: 450000 },
      { name: 'Aqua 600ml', sales: 380000 },
      { name: 'Teh Botol Sosro', sales: 320000 },
    ],
    peakHours: '19:00 - 21:00',
  });

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

  const getSalesForPeriod = () => {
    switch (selectedPeriod) {
      case 'weekly':
        return businessStats.weeklySales;
      case 'monthly':
        return businessStats.monthlySales;
      default:
        return businessStats.dailySales;
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={[typography.h2, styles.greeting]}>
            Welcome, {user?.name}
          </Text>
          <Text style={[typography.bodySecondary, styles.role]}>
            Owner Dashboard
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <IconSymbol name="power" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[commonStyles.card, styles.metricCard]}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.primary} />
            <Text style={[typography.caption, styles.metricLabel]}>Sales</Text>
            <Text style={[typography.h3, { color: colors.primary }]}>
              {formatCurrency(getSalesForPeriod())}
            </Text>
          </View>

          <View style={[commonStyles.card, styles.metricCard]}>
            <IconSymbol name="banknote" size={24} color={colors.secondary} />
            <Text style={[typography.caption, styles.metricLabel]}>Gross Profit</Text>
            <Text style={[typography.h3, { color: colors.secondary }]}>
              {formatCurrency(businessStats.grossProfit)}
            </Text>
          </View>

          <View style={[commonStyles.card, styles.metricCard]}>
            <IconSymbol name="person.2.fill" size={24} color={colors.accent} />
            <Text style={[typography.caption, styles.metricLabel]}>Customers</Text>
            <Text style={[typography.h3, { color: colors.accent }]}>
              {businessStats.totalCustomers.toLocaleString()}
            </Text>
          </View>

          <View style={[commonStyles.card, styles.metricCard]}>
            <IconSymbol name="building.2.fill" size={24} color={colors.primary} />
            <Text style={[typography.caption, styles.metricLabel]}>Total Assets</Text>
            <Text style={[typography.h3, { color: colors.primary }]}>
              {formatCurrency(businessStats.totalAssets)}
            </Text>
          </View>
        </View>

        {/* Top Products */}
        <View style={[commonStyles.card, styles.topProductsCard]}>
          <Text style={[typography.h3, styles.cardTitle]}>Top Products</Text>
          {businessStats.topProducts.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productRank}>
                <Text style={[typography.caption, { color: colors.card }]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={typography.body}>{product.name}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {formatCurrency(product.sales)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Peak Hours */}
        <View style={[commonStyles.card, styles.peakHoursCard]}>
          <View style={commonStyles.row}>
            <IconSymbol name="clock.fill" size={24} color={colors.accent} />
            <View style={{ marginLeft: 12 }}>
              <Text style={[typography.h3, styles.cardTitle]}>Peak Hours</Text>
              <Text style={[typography.body, { color: colors.accent }]}>
                {businessStats.peakHours}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[typography.h3, styles.sectionTitle]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/sales-transaction')}
          >
            <IconSymbol name="cart.fill" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Cashier Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/product-management')}
          >
            <IconSymbol name="cube.box.fill" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/reports')}
          >
            <IconSymbol name="chart.bar.fill" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.highlight, borderWidth: 2, borderColor: colors.primary }]}
            onPress={() => router.push('/employee-management')}
          >
            <IconSymbol name="person.3.fill" size={32} color={colors.primary} />
            <Text style={[typography.body, { color: colors.primary }]}>Employees</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/supplier-management')}
          >
            <IconSymbol name="truck.box.fill" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Suppliers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.secondary }]}
            onPress={() => router.push('/discount-management')}
          >
            <IconSymbol name="percent" size={32} color={colors.card} />
            <Text style={[typography.body, styles.actionText]}>Discounts</Text>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.card,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: (width - 44) / 2,
    alignItems: 'center',
    padding: 16,
  },
  metricLabel: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  topProductsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 12,
  },
  productRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  peakHoursCard: {
    marginBottom: 16,
    backgroundColor: colors.highlight,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: (width - 44) / 2,
    aspectRatio: 1.2,
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
