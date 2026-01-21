import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  _id: string;
  image: string;
  name: string;
  brand: string;
  price: number;
  selectedSize: string;
  quantity: number;
};

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  updateSize: (id: string, oldSize: string, newSize: string) => void; // ✅ Yeni fonksiyon
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (id: string, size: string) => boolean;
  getItemQuantity: (id: string, size: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (item) => {
        const existingItem = get().cartItems.find(
          (cartItem) =>
            cartItem._id === item._id &&
            cartItem.selectedSize === item.selectedSize
        );

        if (existingItem) {
          set({
            cartItems: get().cartItems.map((cartItem) =>
              cartItem._id === item._id &&
              cartItem.selectedSize === item.selectedSize
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          });
        } else {
          set({
            cartItems: [...get().cartItems, { ...item, quantity: 1 }],
          });
        }
      },

      removeFromCart: (id, size) => {
        set({
          cartItems: get().cartItems.filter(
            (item) => !(item._id === id && item.selectedSize === size)
          ),
        });
      },

      increaseQuantity: (id, size) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item._id === id && item.selectedSize === size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (id, size) => {
        set({
          cartItems: get().cartItems
            .map((item) =>
              item._id === id && item.selectedSize === size
                ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      // ✅ Yeni: Size güncelleme fonksiyonu
      updateSize: (id, oldSize, newSize) => {
        const currentItem = get().cartItems.find(
          (item) => item._id === id && item.selectedSize === oldSize
        );

        if (!currentItem) return;

        // Yeni size ile aynı ürün zaten sepette var mı?
        const existingNewSizeItem = get().cartItems.find(
          (item) => item._id === id && item.selectedSize === newSize
        );

        if (existingNewSizeItem) {
          // Varsa: Miktarları birleştir ve eski size'ı sil
          set({
            cartItems: get().cartItems
              .map((item) =>
                item._id === id && item.selectedSize === newSize
                  ? { ...item, quantity: item.quantity + currentItem.quantity }
                  : item
              )
              .filter((item) => !(item._id === id && item.selectedSize === oldSize)),
          });
        } else {
          // Yoksa: Sadece size'ı değiştir
          set({
            cartItems: get().cartItems.map((item) =>
              item._id === id && item.selectedSize === oldSize
                ? { ...item, selectedSize: newSize }
                : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getTotalPrice: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },

      isInCart: (id, size) => {
        return get().cartItems.some(
          (item) => item._id === id && item.selectedSize === size
        );
      },

      getItemQuantity: (id, size) => {
        const item = get().cartItems.find(
          (item) => item._id === id && item.selectedSize === size
        );
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);