export type RootStackParamList = {
  MainTabs: undefined; 
  ProductDetails: { _id: string };
};

export type TabNavigationParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type ProductCardType = {
  _id: string; 
  image?: string;
  name: string;
  brand: string;
  average_rate?: number | string;
  price: number;
  onPress?: () => void;
}