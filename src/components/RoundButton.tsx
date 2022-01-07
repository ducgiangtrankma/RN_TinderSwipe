import React, {FC, useCallback, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
interface RoundButtonProps {
  source: any;
  size: number;
  onPress: () => void;
}
export const RoundButton: FC<RoundButtonProps> = ({source, size, onPress}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = useCallback(
    newValue => {
      Animated.spring(scale, {
        toValue: newValue,
        friction: 4,
        useNativeDriver: true,
      }).start();
    },
    [scale],
  );
  return (
    <TouchableWithoutFeedback
      onPressIn={() => animateScale(0.8)}
      delayPressIn={0}
      onPressOut={() => {
        animateScale(1);
        onPress();
      }}
      delayPressOut={110}>
      <Animated.View style={[styles.container, {transform: [{scale}]}]}>
        <Image source={source} style={{width: size, height: size}} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
