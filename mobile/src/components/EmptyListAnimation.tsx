import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { lottieUrl, COLORS, FONT_FAMILY } from '../constants';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

type EmptyListAnimationProps = {
  title: string;
};

const EmptyListAnimation: React.FC<EmptyListAnimationProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 100,
        }}
        style={styles.animationWrapper}
      >
        <LottieView
          style={styles.lottieStyle}
          source={{ uri: lottieUrl }}
          autoPlay
          loop
        />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 200,
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>No items found</Text>
      </MotiView>
    </View>
  );
};

export default EmptyListAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: COLORS.primaryWhite,
  },
  animationWrapper: {
    marginBottom: 20,
  },
  lottieStyle: {
    width: width * 0.7,
    height: width * 0.7,
    maxWidth: 350,
    maxHeight: 350,
  },
  title: {
    fontSize: 22,
    fontFamily: FONT_FAMILY.poppins_bold,
    color: COLORS.primaryOrange,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.poppins_regular,
    color: COLORS.primaryLightGrey,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});