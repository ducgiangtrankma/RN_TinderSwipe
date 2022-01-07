import React, {FC} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  NativeModules,
  Platform,
  Text,
  Animated,
} from 'react-native';
const {StatusBarManager} = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const {width, height} = Dimensions.get('screen');
const ACTION_OFFSET = 100;
export const heightCard = height * 0.78;
export const widthCard = width * 0.96;
interface CardProps {
  source?: any;
  isFirst?: boolean;
  swipe?: any;
  tiltSign?: any;
}
export const Card: FC<CardProps> = ({
  source,
  isFirst,
  swipe,
  tiltSign,
  ...rest
}) => {
  const rotate = Animated.multiply(swipe.x, tiltSign).interpolate({
    inputRange: [-ACTION_OFFSET, 0, ACTION_OFFSET],
    outputRange: ['8deg', '0deg', '-8deg'],
  });

  const likeOpacity = swipe.x.interpolate({
    inputRange: [10, ACTION_OFFSET],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = swipe.x.interpolate({
    inputRange: [-ACTION_OFFSET, -10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), {rotate: rotate}],
  };
  return (
    <Animated.View
      {...rest}
      style={[isFirst && animatedCardStyle, styles.container]}>
      <Image source={source} style={styles.img} />
      {isFirst && (
        <>
          <Animated.View
            style={[
              styles.choiceContainer,
              styles.likeContainer,
              {opacity: likeOpacity},
            ]}>
            <Text style={[styles.text, styles.likeText]}>LIKE</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.choiceContainer,
              styles.nopeContainer,
              {opacity: nopeOpacity},
            ]}>
            <Text style={[styles.text, styles.nopeText]}>NOPE</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 25,
    alignSelf: 'center',
  },
  img: {
    height: heightCard,
    width: widthCard,
    borderRadius: 15,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 28,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    position: 'absolute',
    top: 25,
  },
  likeText: {
    color: 'green',
    borderColor: 'green',
  },
  nopeText: {
    color: 'red',
    borderColor: 'red',
  },
  choiceContainer: {
    position: 'absolute',
    top: 20,
  },
  likeContainer: {
    left: 45,
    transform: [{rotate: '-15deg'}],
  },
  nopeContainer: {
    right: width - width * 0.7,
    transform: [{rotate: '15deg'}],
  },
});
