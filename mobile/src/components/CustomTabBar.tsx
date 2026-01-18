import { Dimensions, StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { Home, ShoppingCart, User } from 'lucide-react-native';
import { COLORS } from '../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import Animated, {
  LinearTransition,
  FadeInRight,
  FadeOutRight,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type IconProps = {
  name: 'Home' | 'Cart' | 'Profile';
  color: string;
  size?: number;
};

const Icon = ({ name, color, size = 24 }: IconProps) => {
  const icons = {
    Home: Home,
    Cart: ShoppingCart,
    Profile: User,
  };

  const IconComponent = icons[name];
  return <IconComponent color={color} size={size} />;
};

type DataItem = {
  label: string;
  route: string;
  name: 'Home' | 'Cart' | 'Profile';
};

type CustomTabBarType = BottomTabBarProps & {
  data: DataItem[];
  onChange?: (index: number) => void;
  cartCount?: number;
};

const CustomTabBar: React.FC<CustomTabBarType> = ({
  state,
  navigation,
  data,
  onChange,
  cartCount = 0,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { width } = Dimensions.get('window');

  return (
    <MotiView
      from={{ marginBottom: 0, opacity: 0 }}
      animate={{ marginBottom: bottom + 10, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 80,
        stiffness: 500,
      }}
      style={[styles.container, { marginHorizontal: width * 0.06 }]}
    >
      {data.map((item, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            onChange?.(index);
            navigation.navigate(item.route);
          }
        };

        return (
          <MotiView
            transition={{
              type: 'spring',
              damping: 88,
              stiffness: 500,
            }}
            key={index}
            layout={LinearTransition.springify().damping(80).stiffness(200)}
            style={styles.itemView}
          >
            {/* Cart Badge - Sadece seçili değilse ve Cart ise */}
            {!isFocused && item.name === 'Cart' && cartCount > 0 && (
              <View style={styles.productNumberContainer}>
                <Text style={styles.productNumber}>{cartCount}</Text>
              </View>
            )}

            <Pressable
              onPress={onPress}
              style={[
                styles.itemButton,
                {
                  backgroundColor: isFocused
                    ? COLORS.primaryOrange
                    : 'transparent',
                },
              ]}
            >
              <Icon
                name={item.name}
                color={isFocused ? COLORS.primaryVeryWhite : COLORS.primaryDarkGrey}
                size={24}
              />

              {isFocused && (
                <Animated.Text
                  style={[styles.tabLabel, { color: COLORS.primaryVeryWhite }]}
                  exiting={FadeOutRight.springify().damping(80).stiffness(200)}
                  entering={FadeInRight.springify().damping(80).stiffness(200)}
                >
                  {item.label}
                </Animated.Text>
              )}
            </Pressable>
          </MotiView>
        );
      })}
    </MotiView>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.primaryVeryWhite, // Beyaz (HomeScreen ile aynı)
    borderRadius: 50,
    paddingVertical: 12,
    overflow: 'hidden',
    // HomeScreen search bar ile aynı gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    // HomeScreen search bar ile aynı border
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  itemView: {
    overflow: 'hidden',
  },
  itemButton: {
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  tabLabel: { // text -> tabLabel (hata düzeltildi)
    fontSize: 14,
    fontWeight: '600',
  },
  productNumberContainer: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 22,
    height: 22,
    backgroundColor: COLORS.primaryRed,
    borderRadius: 50,
    zIndex: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNumber: {
    color: COLORS.primaryVeryWhite,
    fontSize: 12, // Eklendi
    fontWeight: 'bold', // Eklendi
  },
});