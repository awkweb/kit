import React from 'react';
import { Components } from 'expo';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from '@expo/react-native-fade-in-image';

import Colors from '../constants/colors';

const {BlurView} = Components;
const {height, width} = Dimensions.get('window');
const modalHeight = height / 1.75
const modalWidth = width - 20

export default class ImagePreviewModal extends React.Component {
  render () {
    const source = {uri: this.props.imageUri}
    return (
      <Modal
        transparent={true}
      >
        <BlurView
          style={[styles.container, EStyleSheet.absoluteFill]}
          intensity={85}
          tint={"light"}
        >
          <View
            style={styles.modalBody}
          >
            <View
              style={styles.modalTitleContainer}
            >
              <Text
                ellipsizeMode={"tail"}
                numberOfLines={1}
                style={styles.modalTitle}>
                  {this.props.title}
              </Text>
            </View>
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
      </Modal>
    )
  }
}

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: modalHeight,
    width: modalWidth,
  },
  modalTitleContainer: {
    alignItems: 'flex-start',
    height: 40,
    justifyContent: 'center',
  },
  modalTitle: {
    backgroundColor: 'transparent',
    color: Colors.blackColor,
    fontSize: 16,
    fontWeight: '600',
  },
  imageFadeIn: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    height: modalHeight - 60,
    width: modalWidth - 20,
  },
  image: {
    borderRadius: 10,
    height: modalHeight - 60,
    resizeMode: 'contain',
    width: modalWidth - 20,
  },
});

module.exports = ImagePreviewModal;