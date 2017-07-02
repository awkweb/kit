import React from 'react';
import {
  Linking,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import FadeIn from '@expo/react-native-fade-in-image';
import EStyleSheet from 'react-native-extended-stylesheet';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../../constants/colors';
import { getImageUri } from '../../utils';

export default class RecommendationListItem extends React.Component {
  render () {
    return (
      <View
        style={styles.recommendationListItem}
      >
        <FadeIn
          placeholderStyle={styles.recommendationlImageFadeIn}
        >
          <Image
            style={styles.recommendationlImage}
            source={{uri: getImageUri(this.props.imageUri)}}
          />
        </FadeIn>
        
        <View
          style={styles.recommendationListItemDetails}
        >
          <Text style={styles.recommendationListItemTitle}>{this.props.name}</Text>
          {this.props.description ? <Text style={styles.recommendationListItemDescription}>{this.props.description}</Text> : null}
        </View>

        <TouchableHighlight
          style={styles.buyButton}
          onPress={this._handlePress}
        >
          <FontAwesome
            name={"shopping-cart"}
            size={22}
            color={Colors.whiteColor}
          />
        </TouchableHighlight>
      </View>
    );
  }

  _handlePress = () => {
    Linking.openURL(this.props.url)
  }
}

const styles = EStyleSheet.create({
  recommendationListItem: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.borderColor,
    borderBottomWidth: EStyleSheet.hairlineWidth,
    marginTop: 10,
    paddingVertical: 20,
  },
  recommendationlImageFadeIn: {
    alignSelf: 'center',
    backgroundColor: Colors.grayColors,
    borderRadius: 4,
  },
  recommendationlImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderRadius: 4,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  recommendationListItemDetails: {
    paddingHorizontal: 10,
  },
  recommendationListItemTitle: {
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: '700',
  },
  recommendationListItemDescription: {
    color: Colors.blackColor,
    fontSize: 16,
    marginTop: 10,
  },
  $BUY_BUTTON_SIZE: 36,
  buyButton: {
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
    borderRadius: 4,
    height: '$BUY_BUTTON_SIZE',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: '$BUY_BUTTON_SIZE',
  },
});

module.exports = RecommendationListItem;