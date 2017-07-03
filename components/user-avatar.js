import Expo from 'expo';
import React from 'react';
import { Image } from 'react-native';
import FadeIn from '@expo/react-native-fade-in-image';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';
import { getImageUri } from '../utils';

export default class UserAvatar extends React.Component {
  render () {
    const source = this.props.user.media && this.props.user.media.avatarImageUrl ?
      { uri: getImageUri(this.props.user.media.avatarImageUrl) } : require('../assets/images/avatar.png')
    return (
      <FadeIn>
        <Image
          style={[
            styles.userImage,
            {
              borderRadius: 0.5 * this.props.avatarSize,
              height: this.props.avatarSize,
              width: this.props.avatarSize
            }
          ]}
          source={source}
        />
      </FadeIn>
    )
  }
}

const styles = EStyleSheet.create({
  userImage: {
    backgroundColor: Colors.placeholderColor,  
  },
});

module.exports = UserAvatar;