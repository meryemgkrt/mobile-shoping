import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { RootStackParamList } from '../types';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_FAMILY, ProductDataSample } from '../constants';
import ImageSlider from '../components/ImageSlider';
import { MotiView } from 'moti';
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Info,
  X,
} from 'lucide-react-native';
import { useCartStore } from '../../store/cartStore';

type ProductDetailsScreenProp = RouteProp<RootStackParamList, 'ProductDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

const { width, height } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  // ✅ 1. TÜM HOOK'LARI EN BAŞTA ÇAĞIR
  const route = useRoute<ProductDetailsScreenProp>();
  const navigation = useNavigation<NavigationProp>();
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ 2. HOOK'LARDAN SONRA DEĞİŞKENLER
  const { _id } = route.params;
  const productItem = ProductDataSample.find(item => item._id === _id);
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // ✅ 3. FONKSİYONLAR
  const handleAddToCart = () => {
    if (!productItem) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: productItem._id,
        image: productItem.images[0],
        name: productItem.name,
        brand: productItem.brand,
        price: productItem.prices[0].price,
        selectedSize: selectedSize,
      });
    }

    Alert.alert(
      '🎉 Added to Cart!',
      `${quantity}x ${productItem.name} (Size: ${selectedSize}) added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        {
          text: 'View Cart',
          onPress: () => {
            // Tab navigator içindeki Cart'a git
            navigation.navigate('MainTabs' as never, { screen: 'Cart' } as never);
          },
        },
      ]
    );

    setQuantity(1);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // ✅ 4. EARLY RETURN EN SONDA
  if (!productItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <ArrowLeft color={COLORS.primaryOrange} size={20} strokeWidth={2.5} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ✅ 5. RENDER
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'timing', 
            duration: 500,
            delay: 50,
          }}
          style={{ zIndex: 1 }}
        >
          <ImageSlider imageList={productItem.images} />
        </MotiView>

        <View style={styles.contentContainer}>
          <MotiView
            from={{ opacity: 0, translateY: 30, scale: 0.95 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ 
              type: 'spring', 
              delay: 150,
              damping: 20,
              stiffness: 90,
            }}
          >
            <View style={styles.titleRow}>
              <View style={styles.titleSection}>
                <Text style={styles.brandText}>{productItem.brand}</Text>
                <Text style={styles.nameText} numberOfLines={1}>
                  {productItem.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                <Info color={COLORS.primaryOrange} size={20} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateX: 20, scale: 0.9 }}
            animate={{ opacity: 1, translateX: 0, scale: 1 }}
            transition={{ 
              type: 'spring', 
              delay: 250,
              damping: 18,
              stiffness: 100,
            }}
            style={styles.ratingPriceContainer}
          >
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBadge}>
                <Star size={14} color={COLORS.primaryOrange} fill={COLORS.primaryOrange} />
                <Text style={styles.ratingText}>
                  {productItem.average_rating}
                </Text>
              </View>
              <Text style={styles.ratingCount}>
                ({productItem.ratings_count})
              </Text>
            </View>
            <Text style={styles.priceText}>${productItem.prices[0].price}</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 25, scale: 0.92 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ 
              type: 'spring', 
              delay: 350,
              damping: 20,
              stiffness: 95,
            }}
            style={styles.sizeQuantityRow}
          >
            <View style={styles.sizeSection}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizesContainer}>
                {sizes.slice(0, 4).map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      selectedSize === size && styles.sizeButtonActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Qty</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  activeOpacity={0.7}
                >
                  <Minus size={16} color={COLORS.primaryOrange} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Plus size={16} color={COLORS.primaryOrange} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ 
              type: 'spring', 
              delay: 450,
              damping: 15,
              stiffness: 120,
            }}
            style={{ marginTop: 8 }} 
          >
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.9}
            >
              <ShoppingCart size={20} color={COLORS.primaryWhite} strokeWidth={2} />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </MotiView>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Product Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <X color={COLORS.primaryBlack} size={24} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalProductName}>{productItem.name}</Text>
                <Text style={styles.modalBrand}>{productItem.brand}</Text>
                
                <View style={styles.modalDivider} />
                
                <Text style={styles.modalDescriptionTitle}>Description</Text>
                <Text style={styles.modalDescription}>
                  {productItem.description}
                </Text>

                <View style={styles.modalDivider} />

                <View style={styles.modalInfoRow}>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>Category</Text>
                    <Text style={styles.modalInfoValue}>
                      {productItem.category}
                    </Text>
                  </View>
                  <View style={styles.modalInfoItem}>
                    <Text style={styles.modalInfoLabel}>In Stock</Text>
                    <Text style={styles.modalInfoValue}>
                      {productItem.quantity}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.7}
      >
        <ArrowLeft color={COLORS.primaryOrange} size={20} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryWhite,
  },
  backButton: {
    position: 'absolute',
    top: 64,
    left: 16,
    zIndex: 999,
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: COLORS.primaryOrange,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    marginRight: 8,
  },
  infoButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderWidth: 2,
    borderColor: COLORS.primaryOrange,
  },
  brandText: {
    fontSize: 11,
    color: COLORS.primaryLightGrey,
    fontFamily: FONT_FAMILY.poppins_medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    letterSpacing: -0.3,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryOrange,
  },
  ratingCount: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: COLORS.primaryLightGrey,
  },
  priceText: {
    fontSize: 26,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryOrange,
    letterSpacing: -1,
  },
  sizeQuantityRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sizeSection: {
    flex: 1,
  },
  quantitySection: {
    width: 130,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  sizesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhite,
  },
  sizeButtonActive: {
    borderColor: COLORS.primaryOrange,
    backgroundColor: COLORS.primaryOrange,
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  sizeText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: '#999',
  },
  sizeTextActive: {
    color: COLORS.primaryWhite,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhite,
  },
  quantityText: {
    fontSize: 17,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 36,
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryWhite,
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: COLORS.primaryGrey,
    textAlign: 'center',
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.primaryWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalProductName: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  modalBrand: {
    fontSize: 12,
    color: COLORS.primaryLightGrey,
    fontFamily: FONT_FAMILY.poppins_medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  modalDescriptionTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: '#666',
    lineHeight: 22,
  },
  modalInfoRow: {
    flexDirection: 'row',
    gap: 20,
  },
  modalInfoItem: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 11,
    fontFamily: FONT_FAMILY.poppins_medium,
    color: COLORS.primaryLightGrey,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  modalInfoValue: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryBlack,
  },
  modalCloseButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 6,
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryWhite,
    letterSpacing: 0.5,
  },
});