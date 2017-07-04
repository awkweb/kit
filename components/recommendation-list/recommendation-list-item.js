import React from 'react';
import {
  Dimensions,
  Linking,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import FadeIn from '@expo/react-native-fade-in-image';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../../constants/colors';
import { getImageUri } from '../../utils';

const {width} = Dimensions.get('window');
const recommendationImageSize = (width / 2) - 20;

export default class RecommendationListItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      descriptionMaxLength: 140,
    }
  }

  render () {
    const retailerName = this.props.retailerName.length > 10 ? `${this.props.retailerName.slice(0, 10)}...` : this.props.retailerName
    return (
      <View
        style={styles.recommendationListItem}
      >
        <View
          style={styles.recommendationListItemContainer}
        >
          <FadeIn
            placeholderStyle={styles.recommendationImageFadeIn}
          >
            <Image
              style={styles.recommendationImage}
              source={{uri: getImageUri(this.props.imageUri)}}
            />
          </FadeIn>
          
          <View
            style={styles.recommendationListItemDetails}
          >
            <Text style={styles.recommendationListItemTitle}>{this.props.name}</Text>
            {this.props.description ? this._renderDescription() : null}

            <TouchableHighlight
              activeOpacity={.85}
              style={styles.getItButton}
              onPress={this._handleBuyButtonPress}
            >
              <Text style={styles.getItButtonText}>Get it on {retailerName}</Text>
            </TouchableHighlight>
          </View>
      </View>
      </View>
    );
  }

  _renderDescription = () => {
    const description = this.props.description.length > this.state.descriptionMaxLength ?
      `${this.props.description.slice(0, this.state.descriptionMaxLength)}... ` : this.props.description
    return (
      <Text
         style={styles.recommendationListItemDescriptionContainer}
      >
        <Text style={styles.recommendationListItemDescription}>{description}</Text>
        {this.props.description.length > this.state.descriptionMaxLength ?
          <Text
            activeOpacity={.85}
            style={styles.recommendationListItemDescriptionMore}
            onPress={this._handleDescriptionPress}
          >
            Read more
          </Text> : null}
      </Text>
    )
  }

  _handleBuyButtonPress = () => {
    Linking.openURL(this.props.url)
  }

  _handleDescriptionPress = () => {
    this.setState({descriptionMaxLength: this.props.description.length + 1})
  }
}

const styles = EStyleSheet.create({
  recommendationListItem: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.borderColor,
    borderTopWidth: EStyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  recommendationListItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  recommendationImageFadeIn: {
    backgroundColor: Colors.placeholderColor,
    borderRadius: 4,
  },
  recommendationImage: {
    alignSelf: 'center',
    borderRadius: 4,
    height: recommendationImageSize,
    resizeMode: 'contain',
    width: recommendationImageSize,
  },
  recommendationListItemDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  recommendationListItemTitle: {
    color: Colors.blackColor,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  recommendationListItemDescriptionContainer: {
  },
  recommendationListItemDescription: {
    color: Colors.collectionTextColor,
    fontSize: 12,
  },
  recommendationListItemDescriptionMore: {
    color: Colors.primaryColor,
    fontSize: 12,
    fontWeight: '500',
  },
  $BUY_BUTTON_SIZE: 36,
  getItButton: {
    alignItems: 'center',
    backgroundColor: Colors.blackColor,
    borderRadius: 15,
    justifyContent: 'center',
    height: 30,
    marginTop: 10,
  },
  getItButtonText: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: '600',
  },
});

module.exports = RecommendationListItem;