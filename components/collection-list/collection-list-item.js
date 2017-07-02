import React from 'react';
import {
  ListView,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FadeIn from '@expo/react-native-fade-in-image';
import { FontAwesome } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../../constants/colors';
import { getImageUri } from '../../utils';
import UserAvatar from '../user-avatar';

const MIN_GRID_CELLS = 5;

export default class CollectionListItem extends React.Component {
  constructor (props) {
    super()
    const productCount = props.recommendations.length
    const gridCellCount = Math.min(productCount, MIN_GRID_CELLS)
    const products = props.recommendations.slice(0, gridCellCount)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      recommendations: props.recommendations,
      dataSource: dataSource.cloneWithRows(products),
      productCount: productCount,
      gridCellCount: gridCellCount
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.recommendations != nextProps.recommendations) {
      const productCount = nextProps.recommendations.length
      const gridCellCount = Math.min(productCount, MIN_GRID_CELLS)
      const products = nextProps.recommendations.slice(0, gridCellCount)
      const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
      this.setState({
        dataSource: dataSource.cloneWithRows(products),
        productCount: productCount,
        gridCellCount: gridCellCount
      })
    }
  }

  render () {
    const description = this.props.description && this.props.description.length > 200 ?
      `${this.props.description.slice(0, 200).trim()}...` : this.props.description
    return (
      <View
        style={styles.collectionListItem}
      >
        <TouchableOpacity
          onPress={this._handleOnPress}
          style={styles.collectionListItemHeader}
        >
          <Text style={styles.collectionListItemTitle}>{this.props.name}</Text>
        </TouchableOpacity>

        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.productGrid}
          renderRow={this._renderRow}
        />

        <View
          style={styles.collectionListItemDetails}
        >
          <View style={styles.collectionListItemDetailsSection}>
            <UserAvatar
              user={this.props.user}
              avatarSize={32}
            />
            <Text style={styles.userHandle}>@{this.props.user.username}</Text>
          </View>

          {this.props.user.showcaseInfo.authorityBadge ? this._renderExpertBadge() : this._renderTopics()}
        </View>
      </View>
    );
  }

  _handleOnPress = () => {
    this.props.handleOnPress(this.props.collection)
  }

  _renderRow = (row, sectionID, rowID) => {
    const imageUri = getImageUri(row.media.url)
    const index = parseInt(rowID) + 1
    return (
      <View
        style={[styles.productGridCell, {borderLeftWidth: index == 1 ? EStyleSheet.hairlineWidth : 0}]}
      >
        <FadeIn
          placeholderStyle={styles.productGridCellImageFadeIn}
        >
          <Image
            style={styles.productGridCellImage}
            source={{uri: imageUri}}
          />
        </FadeIn>
        { index == this.state.gridCellCount && this.state.productCount > MIN_GRID_CELLS ? this._renderCellNumber() : null }
      </View>
    )
  }

  _renderCellNumber = () => {
    const text = this.state.productCount - this.state.gridCellCount
    return (
      <View
        style={styles.productGridCellNumber}
      >
        <Text style={styles.productGridCellNumberText}>+{text}</Text>
      </View>
    )
  }

  _renderExpertBadge = () => {
    return (
      <View
        style={styles.collectionListItemDetailsSection}
      >
        <View
          style={styles.expertBadge}
        >
          <FontAwesome
            name={"star"}
            size={14}
            color={Colors.whiteColor}
          />
        </View>
        <Text style={styles.expertBadgeText}>{this.props.user.showcaseInfo.authorityBadge}</Text>
      </View>
    )
  }

  _renderTopics = () => {
    return (
      <View
        style={styles.collectionListItemDetailsSection}
      >
        <Text style={styles.productCountText}>{this.state.productCount} {this.state.productCount > 1 ? 'items' : 'item'}</Text>
      </View>
    )
  }
}

const styles = EStyleSheet.create({
  collectionListItem: {
    alignItems: 'flex-start',
    backgroundColor: Colors.whiteColor,
    paddingVertical: 15,
    marginBottom: 25,
  },
  collectionListItemHeader: {
    paddingHorizontal: 10,
    width: '100%',
  },
  collectionListItemTitle: {
    color: Colors.blackColor,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },
  collectionListItemDetails: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
    width: '100%',
  },
  collectionListItemDetailsSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userHandle: {
    color: Colors.blackColor,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  $EXPERT_BADGE_SIZE: 20,
  expertBadge: {
    alignItems: 'center',
    backgroundColor: Colors.goldColor,
    borderRadius: '0.5 * $EXPERT_BADGE_SIZE',
    height: '$EXPERT_BADGE_SIZE',
    justifyContent: 'center',
    marginRight: 5,
    width: '$EXPERT_BADGE_SIZE',
  },
  expertBadgeText: {
    color: Colors.goldColor,
    fontSize: 14,
    fontWeight: '700',
  },
  productCountText: {
    color: Colors.headerTextColor,
    fontSize: 14,
    fontWeight: '700',
  },
  productGrid: {
    width: '100%',
    borderColor: Colors.borderColor,
    borderTopWidth: EStyleSheet.hairlineWidth,
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  productGridCell: {
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRightWidth: EStyleSheet.hairlineWidth,
    justifyContent: 'center',
    padding: 20,
  },
  productGridCellImageFadeIn: {
    backgroundColor: Colors.placeholderColor,
    borderRadius: 4,
  },
  productGridCellImage: {
    height: 100,
    width: 100,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  productGridCellNumber: {
    alignItems: 'center',
    backgroundColor: Colors.whiteColorAlpha,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  productGridCellNumberText: {
    backgroundColor: 'transparent',
    color: Colors.blackColor,
    fontSize: 28,
    fontWeight: '500',
  },
});

module.exports = CollectionListItem;