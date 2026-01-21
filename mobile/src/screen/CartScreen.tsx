import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY } from '../constants';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PaymentFooter from '../components/PaymentFooter';
import { MotiView } from 'moti';
import CartItem from '../components/CartItem';
import { ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useCartStore } from "../../store/cartStore";

type RootStackParamList = {
  MainTabs: undefined;
};

const HEADER_ANIMATION = {
  from: { opacity: 0, translateY: -20 },
  animate: { opacity: 1, translateY: 0 },
  transition: { type: 'timing' as const, duration: 400 },
};

const BUTTON_ANIMATION = {
  from: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring' as const, delay: 400, damping: 15 },
};

const CartScreen = () => {
  // ✅ TÜM HOOK'LARI EN ÜSTTE TOPLUYORUZ
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const cartItems = useCartStore((state) => state.cartItems);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateSize = useCartStore((state) => state.updateSize);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // ✅ Derived state
  const totalPrice = getTotalPrice();
  const isCartEmpty = cartItems.length === 0;

  // ✅ Callbacks
  const handleCheckout = useCallback(() => {
    console.log('Proceeding to checkout with total:', totalPrice);
  }, [totalPrice]);

  const handleStartShopping = useCallback(() => {
    navigation.navigate('MainTabs');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <MotiView {...HEADER_ANIMATION} style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        {!isCartEmpty && (
          <Text style={styles.itemCount}>{cartItems.length} items</Text>
        )}
      </MotiView>

      {isCartEmpty ? (
        <View style={styles.emptyContainer}>
          <EmptyListAnimation title="Your cart is empty" />

          <MotiView {...BUTTON_ANIMATION} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.startShoppingButton}
              onPress={handleStartShopping}
              activeOpacity={0.9}
            >
              <ShoppingBag size={22} color={COLORS.primaryWhite} strokeWidth={2} />
              <Text style={styles.startShoppingText}>Start Shopping</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      ) : (
        <View style={styles.contentWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.listItemContainer}>
              {cartItems.map((item, index) => (
                <MotiView
                  key={`${item._id}-${item.selectedSize}`}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{
                    type: 'spring',
                    delay: index * 100,
                    damping: 15,
                  }}
                >
                  <CartItem
                    _id={item._id}
                    image={item.image}
                    name={item.name}
                    brand={item.brand}
                    price={item.price}
                    selectedSize={item.selectedSize}
                    quantity={item.quantity}
                    onPlusButtonPress={() => increaseQuantity(item._id, item.selectedSize)}
                    onMinusButtonPress={() => decreaseQuantity(item._id, item.selectedSize)}
                    onRemove={() => removeFromCart(item._id, item.selectedSize)}
                    onSizeChange={(newSize) => updateSize(item._id, item.selectedSize, newSize)}
                  />
                </MotiView>
              ))}
            </View>
          </ScrollView>

          <PaymentFooter
            price={totalPrice}
            onPress={handleCheckout}
            buttonTitle="Proceed to Checkout"
            loading={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: COLORS.primaryWhite,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    letterSpacing: -0.5,
  },
  itemCount: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: COLORS.primaryLightGrey,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 40,
  },
  startShoppingButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 14,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  startShoppingText: {
    fontSize: 17,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryWhite,
    letterSpacing: 0.3,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  listItemContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
  },
});