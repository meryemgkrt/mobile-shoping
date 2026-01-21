import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONT_FAMILY } from "../constants";
import { Plus, Minus, Trash2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type CartItemType = {
  _id: string;
  image: string;
  name: string;
  brand?: string;
  price: number;
  selectedSize: string;
  quantity: number;
  onPlusButtonPress: () => void;
  onMinusButtonPress: () => void;
  onRemove: () => void;
};

const CartItem: React.FC<CartItemType> = (props) => {
  // ✅ hooks en başta
  const plusScale = useSharedValue(1);
  const minusScale = useSharedValue(1);
  const trashScale = useSharedValue(1);

  const plusAnim = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));
  const minusAnim = useAnimatedStyle(() => ({
    transform: [{ scale: minusScale.value }],
  }));
  const trashAnim = useAnimatedStyle(() => ({
    transform: [{ scale: trashScale.value }],
  }));

  const {
    image,
    name,
    brand,
    price,
    selectedSize,
    quantity,
    onPlusButtonPress,
    onMinusButtonPress,
    onRemove,
  } = props;

  const totalPrice = (price * quantity).toFixed(2);

  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageBox}>
        <ImageBackground
          source={{ uri: image }}
          style={styles.image}
          imageStyle={styles.imageRadius}
          resizeMode="cover"
        />
      </View>

      {/* Right Content */}
      <View style={styles.rightContent}>
        {/* Top Section: Brand + Name + Remove */}
        <View style={styles.topSection}>
          <View style={styles.productInfo}>
            {brand && <Text style={styles.brandText}>{brand}</Text>}
            <Text style={styles.nameText} numberOfLines={2}>
              {name}
            </Text>
            <View style={styles.detailsRow}>
              <Text style={styles.sizeText}>Size: {selectedSize}</Text>
              <View style={styles.priceBadge}>
                <Text style={styles.unitPriceText}>${price.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <AnimatedTouchableOpacity
            style={[styles.removeBtn, trashAnim]}
            onPressIn={() => (trashScale.value = withSpring(0.88))}
            onPressOut={() => (trashScale.value = withSpring(1))}
            onPress={onRemove}
            activeOpacity={1}
          >
            <Trash2 size={18} color={COLORS.primaryOrange} strokeWidth={2.5} />
          </AnimatedTouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom Section: Total Price + Quantity Controls */}
        <View style={styles.bottomSection}>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
          </View>

          <View style={styles.quantityControls}>
            <AnimatedTouchableOpacity
              style={[styles.controlBtn, minusAnim]}
              onPressIn={() => (minusScale.value = withSpring(0.88))}
              onPressOut={() => (minusScale.value = withSpring(1))}
              onPress={onMinusButtonPress}
              activeOpacity={1}
            >
              <Minus size={16} color={COLORS.primaryOrange} strokeWidth={2.5} />
            </AnimatedTouchableOpacity>

            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            <AnimatedTouchableOpacity
              style={[styles.controlBtn, plusAnim]}
              onPressIn={() => (plusScale.value = withSpring(0.88))}
              onPressOut={() => (plusScale.value = withSpring(1))}
              onPress={onPlusButtonPress}
              activeOpacity={1}
            >
              <Plus size={16} color={COLORS.primaryOrange} strokeWidth={2.5} />
            </AnimatedTouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },

  imageBox: {
    width: 100,
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#ECECEC",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageRadius: {
    borderRadius: 16,
  },

  rightContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
  },

  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },

  productInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  brandText: {
    fontFamily: FONT_FAMILY.poppins_medium,
    fontSize: 10,
    color: COLORS.primaryLightGrey,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  nameText: {
    fontFamily: FONT_FAMILY.poppins_bold,
    fontSize: 14,
    color: COLORS.primaryBlack,
    lineHeight: 18,
    marginBottom: 2,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    gap: 8,
  },

  sizeText: {
    fontFamily: FONT_FAMILY.poppins_medium,
    fontSize: 11,
    color: COLORS.primaryLightGrey,
  },

  priceBadge: {
    backgroundColor: "#FFF5F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryOrange + "20",
  },

  unitPriceText: {
    fontFamily: FONT_FAMILY.poppins_semibold,
    fontSize: 11,
    color: COLORS.primaryOrange,
    letterSpacing: -0.2,
  },

  removeBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#FFF7F4",
    borderWidth: 1.5,
    borderColor: COLORS.primaryOrange + "30",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 10,
  },

  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  totalPriceContainer: {
    flex: 1,
    gap: 2,
  },

  totalLabel: {
    fontFamily: FONT_FAMILY.poppins_medium,
    fontSize: 10,
    color: COLORS.primaryLightGrey,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  totalPrice: {
    fontFamily: FONT_FAMILY.poppins_bold,
    fontSize: 18,
    color: COLORS.primaryOrange,
    letterSpacing: -0.5,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 10,
    flexShrink: 0,
  },

  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.primaryOrange,
    backgroundColor: COLORS.primaryWhite,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  quantityBox: {
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontFamily: FONT_FAMILY.poppins_bold,
    fontSize: 15,
    color: COLORS.primaryBlack,
    textAlign: "center",
  },
});