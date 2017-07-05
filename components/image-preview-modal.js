import React from 'react';
import { Components } from 'expo';
import {
  Dimensions,
  Image,
  Text,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from '@expo/react-native-fade-in-image';

import Colors from '../constants/colors';

const {BlurView} = Components;
const {height, width} = Dimensions.get('window');

export default class ImagePreviewModal extends React.Component {
  render () {
    const source = {uri: this.props.imageUri}
    return (
      <BlurView
        style={[styles.container, EStyleSheet.absoluteFill]}
        intensity={75}
        tint={"light"}
      >
        <View
          style={styles.modal}
        >
          <Text>{this.props.title}</Text>
          <FadeIn
            placeholderStyle={styles.imageFadeIn}
          >
            <Image
              style={styles.image}
              source={source}
            />
          </FadeIn>
        </View>
      </BlurView>
    )
  }
}

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    height: height / 1.5,
    width: width - 20,
  },
  imageFadeIn: {
    backgroundColor: Colors.whiteColor,
    height: height / 1.5,
    width: width - 20,
  },
  image: {
    height: height / 1.5,
    width: width - 20,
    borderRadius: 4,
    resizeMode: 'contain',
  },
});

module.exports = ImagePreviewModal;