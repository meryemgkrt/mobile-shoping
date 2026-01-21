import { StyleSheet, View, Image, Dimensions, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

type ImagesSliderProps = {
  imageList: string[];
};

const ImageSlider: React.FC<ImagesSliderProps> = ({ imageList }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  // URL'leri düzelt - Unsplash parametrelerini ekle
  const fixImageUrl = (url: string) => {
    if (url.includes('unsplash.com') && !url.includes('?')) {
      return `${url}?auto=format&fit=crop&w=800&q=80`;
    }
    return url;
  };

  const fixedImages = imageList?.map(url => fixImageUrl(url)) || [];

  if (!fixedImages || fixedImages.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fixedImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
      
      <View style={styles.dotContainer}>
        {fixedImages.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: COLORS.primaryVeryWhite,
  },
  image: {
    width: width,
    height: 400,
  },
  dotContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primaryOrange,
    width: 24,
  },
});