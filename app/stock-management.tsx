
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface StockItem {
  id: string;
  name: string;
  category: string;
  stockBox: number;
  stockPcs: number;
  pcsPerBox: number;
  minStock: number;
  barcode: string;
}

const mockStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Indomie Goreng',
    category: 'Makanan',
    stockBox: 5,
    stockPcs: 20,
    pcsPerBox: 40,
    minStock: 50,
    barcode: '8992388101010',
  },
  {
    id: '2',
    name: 'Aqua 600ml',
    category: 'Minuman',
    stockBox: 3,
    stockPcs: 15,
    pcsPerBox: 24,
    minStock: 30,
    barcode: '8992388202020',
  },
  {
    id: '3',
    name: 'Teh Botol Sosro',
    category: 'Minuman',
    stockBox: 2,
    stockPcs: 10,
    pcsPerBox: 24,
    minStock: 25,
    barcode: '8992388303030',
  },
  {
    id: '4',
    name: 'Kopi Kapal Api',
    category: 'Minuman',
    stockBox: 1,
    stockPcs: 5,
    pcsPerBox: 12,
    minStock: 20,
    barcode: '8992388404040',
  },
];

export default function StockManagementScreen() {
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(stockItems.map(item => item.category)))];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openBox = (itemId: string) => {
    Alert.alert(
      'Open Box',
      'Are you sure you want to open 1 box? This will reduce box stock by 1 and increase piece stock.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Box',
          onPress: () => {
            setStockItems(items =>
              items.map(item =>
                item.id === itemId && item.stockBox > 0
                  ? {
                      ...item,
                      stockBox: item.stockBox - 1,
                      stockPcs: item.stockPcs + item.pcsPerBox,
                    }
                  : item
              )
            );
            Alert.alert('Success', 'Box opened successfully');
          },
        },
      ]
    );
  };

  const addStock = (itemId: string) => {
    Alert.prompt(
      'Add Stock',
      'Enter number of pieces to add:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (value) => {
            const quantity = parseInt(value || '0');
            if (quantity > 0) {
              setStockItems(items =>
                items.map(item =>
                  item.id === itemId
                    ? { ...item, stockPcs: item.stockPcs + quantity }
                    : item
                )
              );
              Alert.alert('Success', `Added ${quantity} pieces to stock`);
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const getStockStatus = (item: StockItem) => {
    const totalPcs = item.stockPcs + (item.stockBox * item.pcsPerBox);
    if (totalPcs <= item.minStock) {
      return { status: 'Low', color: colors.error };
    } else if (totalPcs <= item.minStock * 1.5) {
      return { status: 'Medium', color: colors.accent };
    } else {
      return { status: 'Good', color: colors.secondary };
    }
  };

  const renderStockItem = ({ item }: { item: StockItem }) => {
    const stockStatus = getStockStatus(item);
    const totalPcs = item.stockPcs + (item.stockBox * item.pcsPerBox);

    return (
      <View style={[commonStyles.card, styles.stockItem]}>
        <View style={styles.stockHeader}>
          <View style={styles.stockInfo}>
            <Text style={[typography.body, styles.itemName]}>{item.name}</Text>
            <Text style={[typography.caption, styles.itemCategory]}>{item.category}</Text>
            <Text style={[typography.caption, styles.itemBarcode]}>
              Barcode: {item.barcode}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: stockStatus.color }]}>
            <Text style={[typography.caption, { color: colors.card }]}>
              {stockStatus.status}
            </Text>
          </View>
        </View>

        <View style={styles.stockDetails}>
          <View style={styles.stockRow}>
            <Text style={typography.caption}>Box Stock:</Text>
            <Text style={[typography.body, { fontWeight: '600' }]}>
              {item.stockBox} boxes
            </Text>
          </View>
          <View style={styles.stockRow}>
            <Text style={typography.caption}>Piece Stock:</Text>
            <Text style={[typography.body, { fontWeight: '600' }]}>
              {item.stockPcs} pcs
            </Text>
          </View>
          <View style={styles.stockRow}>
            <Text style={typography.caption}>Total Available:</Text>
            <Text style={[typography.body, { fontWeight: '600', color: colors.primary }]}>
              {totalPcs} pcs
            </Text>
          </View>
          <View style={styles.stockRow}>
            <Text style={typography.caption}>Min Stock:</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {item.minStock} pcs
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => openBox(item.id)}
            disabled={item.stockBox === 0}
          >
            <IconSymbol name="shippingbox" size={16} color={colors.card} />
            <Text style={[typography.caption, { color: colors.card, fontWeight: '600' }]}>
              Open Box
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => addStock(item.id)}
          >
            <IconSymbol name="plus" size={16} color={colors.card} />
            <Text style={[typography.caption, { color: colors.card, fontWeight: '600' }]}>
              Add Stock
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h2, styles.title]}>Stock Management</Text>
        <TouchableOpacity style={styles.scanButton}>
          <IconSymbol name="barcode.viewfinder" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or barcode..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stock Items List */}
        <FlatList
          data={filteredItems}
          renderItem={renderStockItem}
          keyExtractor={(item) => item.id}
          style={styles.stockList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.stockListContent}
        />
      </View>
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
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  scanButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryFilterContent: {
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: colors.card,
  },
  stockList: {
    flex: 1,
  },
  stockListContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for floating elements
  },
  stockItem: {
    marginBottom: 16,
    padding: 16,
  },
  stockHeader: {
    ...commonStyles.spaceBetween,
    marginBottom: 16,
  },
  stockInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemBarcode: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockDetails: {
    marginBottom: 16,
    gap: 8,
  },
  stockRow: {
    ...commonStyles.spaceBetween,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
});
