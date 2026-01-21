import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import { ProductCardType } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT_FAMILY } from '../constants';
import { Star, Plus } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useCartStore } from "../../store/cartStore";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ProductCard: React.FC<ProductCardType> = ({
  _id,
  image,
  name,
  brand,
  average_rate,
  price,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const addToCart = useCartStore(state => state.addToCart);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAddToCart = () => {
    if (!image || !_id) {
      Alert.alert('Hata', 'Ürün bilgileri eksik!');
      return;
    }

    addToCart({
      _id,
      image,
      name: name || 'Ürün',
      brand: brand || 'Bilinmeyen Marka',
      price: price || 0,
      selectedSize: 'M',
    });
    
    Alert.alert('Başarılı', `${name} sepete eklendi!`, [{ text: 'Tamam' }]);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F8F8']}
      style={styles.linearGradient}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: image }}
            style={styles.cardImage}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            {average_rate ? (
              <View style={styles.ratingBadge}>
                <Star
                  size={12}
                  color={COLORS.primaryOrange}
                  fill={COLORS.primaryOrange}
                />
                <Text style={styles.ratingText}>{average_rate}</Text>
              </View>
            ) : null}
          </ImageBackground>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.brandText}>{brand}</Text>
          <Text style={styles.nameText} numberOfLines={2}>
            {name}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.priceText}>${price}</Text>
            
            <AnimatedTouchableOpacity
              style={[styles.plusButton, animatedStyle]}
              onPressIn={() => { scale.value = withSpring(0.85); }}
              onPressOut={() => { scale.value = withSpring(1); }}
              onPress={handleAddToCart}
              activeOpacity={1}
            >
              <Plus size={18} color={COLORS.primaryVeryWhite} strokeWidth={3} />
            </AnimatedTouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  linearGradient: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryVeryWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryVeryWhite,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.primaryBlack,
    fontFamily: FONT_FAMILY.poppins_semibold,
    marginLeft: 4,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: COLORS.primaryVeryWhite,
    minHeight: 110,
  },
  brandText: {
    fontSize: 11,
    color: COLORS.primaryLightGrey,
    fontFamily: FONT_FAMILY.poppins_regular,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nameText: {
    fontSize: 13,
    color: COLORS.primaryBlack,
    fontFamily: FONT_FAMILY.poppins_semibold,
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceText: {
    fontSize: 16,
    color: COLORS.primaryOrange,
    fontFamily: FONT_FAMILY.poppins_bold,
    letterSpacing: 0.3,
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});