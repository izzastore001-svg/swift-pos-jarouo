
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

interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Indomie Goreng', price: 3500, barcode: '8992388101010', stock: 100 },
  { id: '2', name: 'Aqua 600ml', price: 4000, barcode: '8992388202020', stock: 50 },
  { id: '3', name: 'Teh Botol Sosro', price: 5000, barcode: '8992388303030', stock: 75 },
  { id: '4', name: 'Kopi Kapal Api', price: 2500, barcode: '8992388404040', stock: 30 },
  { id: '5', name: 'Biskuit Roma', price: 8000, barcode: '8992388505050', stock: 25 },
];

export default function SalesTransactionScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'non-cash' | 'qris' | 'debt'>('cash');

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.includes(searchQuery)
  );

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal; // Add tax/discount calculations here if needed
  const change = parseFloat(cashReceived) - total;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, subtotal: product.price }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item
      ));
    }
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setCart([]) },
      ]
    );
  };

  const processTransaction = () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    if (selectedPaymentMethod === 'cash' && (parseFloat(cashReceived) < total || !cashReceived)) {
      Alert.alert('Error', 'Insufficient cash received');
      return;
    }

    Alert.alert(
      'Transaction Complete',
      `Total: ${formatCurrency(total)}\nPayment: ${selectedPaymentMethod.toUpperCase()}\n${selectedPaymentMethod === 'cash' ? `Change: ${formatCurrency(change)}` : ''}`,
      [
        {
          text: 'Print Receipt',
          onPress: () => {
            // Print receipt logic here
            setCart([]);
            setCashReceived('');
            Alert.alert('Success', 'Receipt printed successfully');
          }
        },
        {
          text: 'New Transaction',
          onPress: () => {
            setCart([]);
            setCashReceived('');
          }
        }
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => addToCart(item)}
    >
      <View style={styles.productInfo}>
        <Text style={typography.body}>{item.name}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Stock: {item.stock} | {formatCurrency(item.price)}
        </Text>
      </View>
      <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={typography.body}>{item.name}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {formatCurrency(item.price)} each
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <IconSymbol name="minus" size={16} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[typography.body, styles.quantityText]}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <IconSymbol name="plus" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={[typography.body, { fontWeight: '600' }]}>
        {formatCurrency(item.subtotal)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h2, styles.title]}>Sales Transaction</Text>
        <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
          <IconSymbol name="trash" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Product Search and List */}
        <View style={styles.leftPanel}>
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            style={styles.productList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Cart and Payment */}
        <View style={styles.rightPanel}>
          <View style={[commonStyles.card, styles.cartCard]}>
            <Text style={[typography.h3, styles.sectionTitle]}>Cart ({cart.length})</Text>
            
            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <IconSymbol name="cart" size={48} color={colors.textSecondary} />
                <Text style={[typography.bodySecondary, { textAlign: 'center' }]}>
                  Cart is empty{'\n'}Add products to start transaction
                </Text>
              </View>
            ) : (
              <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                style={styles.cartList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Payment Section */}
          <View style={[commonStyles.card, styles.paymentCard]}>
            <Text style={[typography.h3, styles.sectionTitle]}>Payment</Text>
            
            {/* Payment Method Selection */}
            <View style={styles.paymentMethods}>
              {(['cash', 'non-cash', 'qris', 'debt'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentMethod,
                    selectedPaymentMethod === method && styles.paymentMethodActive,
                  ]}
                  onPress={() => setSelectedPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.paymentMethodText,
                      selectedPaymentMethod === method && styles.paymentMethodTextActive,
                    ]}
                  >
                    {method.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Cash Input */}
            {selectedPaymentMethod === 'cash' && (
              <View style={styles.cashInputContainer}>
                <Text style={[typography.caption, styles.inputLabel]}>Cash Received</Text>
                <TextInput
                  style={[commonStyles.input, styles.cashInput]}
                  value={cashReceived}
                  onChangeText={setCashReceived}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            )}

            {/* Total Summary */}
            <View style={styles.totalSummary}>
              <View style={commonStyles.spaceBetween}>
                <Text style={typography.body}>Subtotal:</Text>
                <Text style={typography.body}>{formatCurrency(subtotal)}</Text>
              </View>
              <View style={commonStyles.spaceBetween}>
                <Text style={[typography.h3, { fontWeight: '700' }]}>Total:</Text>
                <Text style={[typography.h3, { fontWeight: '700', color: colors.primary }]}>
                  {formatCurrency(total)}
                </Text>
              </View>
              {selectedPaymentMethod === 'cash' && cashReceived && (
                <View style={commonStyles.spaceBetween}>
                  <Text style={typography.body}>Change:</Text>
                  <Text style={[typography.body, { color: change >= 0 ? colors.secondary : colors.error }]}>
                    {formatCurrency(Math.max(0, change))}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                commonStyles.button,
                styles.processButton,
                (cart.length === 0 || (selectedPaymentMethod === 'cash' && change < 0)) && styles.disabledButton,
              ]}
              onPress={processTransaction}
              disabled={cart.length === 0 || (selectedPaymentMethod === 'cash' && change < 0)}
            >
              <Text style={[commonStyles.buttonText, styles.processButtonText]}>
                Process Transaction
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  clearButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 1,
    padding: 16,
  },
  rightPanel: {
    width: 350,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  productList: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productInfo: {
    flex: 1,
  },
  cartCard: {
    flex: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartItemInfo: {
    flex: 1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  paymentCard: {
    minHeight: 300,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  paymentMethod: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: colors.highlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentMethodActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentMethodText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
  },
  paymentMethodTextActive: {
    color: colors.card,
  },
  cashInputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '600',
    color: colors.text,
  },
  cashInput: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
  },
  totalSummary: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  processButton: {
    paddingVertical: 16,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
