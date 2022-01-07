import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {icons, images} from './src/assets';
import {Card, heightCard, widthCard} from './src/components/Card';
import {RoundButton} from './src/components/RoundButton';

interface AppProps {}
const App: FC<AppProps> = ({}) => {
  const [listImages, setListImage] = useState(images);
  const swipe = useRef(new Animated.ValueXY()).current;
  const tiltSign = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!listImages.length) {
      setListImage(images);
    }
  }, [listImages.length]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy, y0}) => {
      swipe.setValue({x: dx, y: dy});
      tiltSign.setValue(y0 > heightCard / 2 ? 1 : -1);
    },
    onPanResponderRelease: (_, {dx, dy}) => {
      const direction = Math.sign(dx);
      const isActionActive = Math.abs(dx) > 100;

      if (isActionActive) {
        Animated.timing(swipe, {
          duration: 200,
          toValue: {
            x: direction * (widthCard + 0.5 * widthCard),
            y: dy,
          },
          useNativeDriver: true,
        }).start(removeTopCard);
      } else {
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      }
    },
  });

  const removeTopCard = useCallback(() => {
    setListImage(prevState => prevState.slice(1));
    swipe.setValue({x: 0, y: 0});
  }, [swipe]);

  const handleChoice = useCallback(
    direction => {
      Animated.timing(swipe.x, {
        toValue: direction * (widthCard + 0.5 * widthCard),
        duration: 400,
        useNativeDriver: true,
      }).start(removeTopCard);
    },
    [removeTopCard, swipe.x],
  );

  return (
    <SafeAreaView style={styles.container}>
      {listImages
        .map((e, index) => {
          const isFirst = index === 0;
          const dragHandlers = isFirst ? panResponder.panHandlers : {};
          return (
            <Card
              key={e.id}
              source={e.uri}
              isFirst={isFirst}
              swipe={swipe}
              tiltSign={tiltSign}
              {...dragHandlers}
            />
          );
        })
        .reverse()}
      <View style={styles.footer}>
        <RoundButton
          source={icons.nope}
          size={30}
          onPress={() => handleChoice(-1)}
        />
        <RoundButton
          source={icons.heart}
          size={48}
          onPress={() => handleChoice(1)}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 45,
    width: 170,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    zIndex: -1,
  },
});
export default App;
