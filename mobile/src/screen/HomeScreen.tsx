import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  COLORS,
  homeTitle,
  FONT_FAMILY,
  categories,
  ProductDataSample,
} from '../constants';
import { MotiView } from 'moti';
import { Search, X } from 'lucide-react-native';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type HomeScreenPropType = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenPropType>();
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    index: 0,
    category: categories[0],
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  const animatedTitle = homeTitle.split(' ');
  const AllCategories = selectedCategory.category === 'All';

  const filteredProductsWithCategory = ProductDataSample.filter(
    item => AllCategories ? item : item.category === selectedCategory.category
  );

  const filteredProductsWithSearch = filteredProductsWithCategory.filter(
    item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          {animatedTitle.map((item, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              onDidAnimate={(key, finished) => {
                if (key === 'translateY' && finished && step === 1) {
                  setStep(2);
                }
              }}
              transition={{
                type: 'timing',
                delay: index * 30,
                duration: 400,
              }}
            >
              <Text style={styles.titleText}>{item} </Text>
            </MotiView>
          ))}
        </View>

        {/* Search */}
        <MotiView
          style={styles.searchContainer}
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: step >= 2 ? 1 : 0, 
            scale: step >= 2 ? 1 : 0.5 
          }}
          onDidAnimate={(key, finished) => {
            if (key === 'opacity' && finished && step === 2) {
              setStep(3);
            }
          }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 50,
            delay: 300,
          }}
        >
          <Search
            color={
              searchText.length > 0 || isFocused
                ? COLORS.primaryOrange
                : COLORS.primaryLightGrey
            }
            size={20}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Find your product..."
            placeholderTextColor={COLORS.secondaryLightGrey}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <X color={COLORS.primaryLightGrey} size={16} />
            </TouchableOpacity>
          )}
        </MotiView>

        {/* Categories */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContentStyle}
          data={categories}
          keyExtractor={item => item}
          renderItem={({ index, item }) => (
            <MotiView
              style={styles.categoryAnimate}
              from={{ opacity: 0, translateY: -10 }}
              animate={{ 
                opacity: step >= 3 ? 1 : 0, 
                translateY: step >= 3 ? 0 : -10 
              }}
              onDidAnimate={(key, finished) => {
                if (key === 'translateY' && finished && step === 3) {
                  setStep(4);
                }
              }}
              transition={{
                type: 'spring',
                delay: 50 * index,
                damping: 12,
                stiffness: 150,
              }}
            >
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() =>
                  setSelectedCategory({ index, category: categories[index] })
                }
              >
                <Text
                  style={[
                    styles.categoryTitle,
                    selectedCategory.index === index && styles.categoryActive,
                  ]}
                >
                  {item}
                </Text>
                {selectedCategory.index === index && (
                  <MotiView
                    style={styles.activeCircle}
                    from={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 20 
                    }}
                  />
                )}
              </TouchableOpacity>
            </MotiView>
          )}
        />

        {/* Products Section */}
        <FlatList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={filteredProductsWithSearch}
          ListEmptyComponent={() => (
            <MotiView
              from={{
                opacity: 0,
                translateY: 15,
              }}
              animate={{
                opacity: step >= 4 ? 1 : 0,
                translateY: step >= 4 ? 0 : 15,
              }}
              style={styles.emptyListContainer}
            >
              <Text style={styles.emptyListText}>No Product Available</Text>
            </MotiView>
          )}
          numColumns={2}
          contentContainerStyle={styles.productListContent}
          keyExtractor={item => item._id}
          renderItem={({ index, item }) => {
            const isLeftColumn = index % 2 === 0;
            return (
              <MotiView
                from={{
                  opacity: 0,
                  translateY: 15,
                }}
                animate={{
                  opacity: step >= 4 ? 1 : 0,
                  translateY: step >= 4 ? 0 : 15,
                  marginRight: isLeftColumn ? 22 : 0,
                }}
                onDidAnimate={(key, finished) => {
                  if (key === 'opacity' && finished && step === 4) {
                    setStep(5);
                  }
                }}
                transition={{
                  type: 'spring',
                  damping: 12,
                  stiffness: 30,
                  delay: index * 200,
                }}
              >
                <ProductCard
                  _id={item._id}
                  image={item.images[0]}
                  name={item.name}
                  brand={item.brand}
                  average_rate={item.average_rating}
                  price={Number(item.prices[0].price)}
                  onPress={() => navigation.navigate('ProductDetails', { _id: item._id })}
                />
              </MotiView>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryWhite,
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 28,
    color: COLORS.primaryBlack,
    fontFamily: FONT_FAMILY.poppins_semibold,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryVeryWhite,
    borderRadius: 20,
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.primaryBlack,
    fontFamily: FONT_FAMILY.poppins_regular,
  },
  categoryContentStyle: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  categoryAnimate: {
    paddingHorizontal: 5,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  categoryTitle: {
    fontFamily: FONT_FAMILY.poppins_semibold,
    fontSize: 15,
    letterSpacing: 0.3,
    textAlign: 'center',
    color: COLORS.primaryLightGrey,
  },
  categoryActive: {
    color: COLORS.primaryOrange,
  },
  activeCircle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryOrange,
    marginTop: 6,
  },
  productListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyListText: {
    fontSize: 16,
    color: COLORS.primaryLightGrey,
    fontFamily: FONT_FAMILY.poppins_regular,
  },
});