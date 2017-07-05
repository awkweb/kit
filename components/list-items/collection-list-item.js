import React from 'react';
import {
  Dimensions,
  ListView,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FadeIn from '@expo/react-native-fade-in-image';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../../constants/colors';
import { getImageUri } from '../../utils';
import UserAvatar from '../user-avatar';
import ExpertBadge from '../expert-badge';

const MAX_GRID_CELLS = 6;
const {width} = Dimensions.get('window');
const recommendationImageSize = (width / 3) - 40.5;

export default class CollectionListItem extends React.Component {
  constructor (props) {
    super(props)
    const recommendationCount = props.recommendations.length
    const gridCellCount = Math.min(recommendationCount, MAX_GRID_CELLS)
    const initialRecommendations = props.recommendations.slice(0, gridCellCount)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      recommendations: props.recommendations,
      dataSource: dataSource.cloneWithRows(initialRecommendations),
      recommendationCount: recommendationCount,
      gridCellCount: gridCellCount,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.recommendations != nextProps.recommendations) {
      const recommendationCount = nextProps.recommendations.length
      const gridCellCount = Math.min(recommendationCount, MAX_GRID_CELLS)
      const recommendations = nextProps.recommendations.slice(0, gridCellCount)
      const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
      this.setState({
        dataSource: dataSource.cloneWithRows(recommendations),
        recommendationCount: recommendationCount,
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
          activeOpacity={.85}
          onPress={this._handleTitlePress}
          style={styles.collectionListItemHeader}
        >
          <Text style={styles.collectionListItemTitle}>{this.props.name}</Text>
          <View style={styles.collectionLikeCount}>
            <Ionicons
              name={"ios-heart"}
              size={18}
              color={Colors.grayColor}
            />
            <Text style={styles.collectionLikeCountText}>{this.props.likes}</Text>
          </View>
        </TouchableOpacity>

        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          horizontal={true}
          initialListSize={3}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          style={styles.recommendationGrid}
          renderRow={this._renderRow}
        />

        <View
          style={styles.collectionListItemDetails}
        >
          <TouchableOpacity
            activeOpacity={.85}
            onPress={this._handleUserPress}
          >
            <View style={styles.collectionListItemDetailsSection}>
              <UserAvatar
                user={this.props.user}
                avatarSize={32}
              />
              {this.props.user.showcaseInfo.authorityBadge ? <ExpertBadge description={this.props.user.showcaseInfo.authorityBadge} /> : null}
            </View>
          </TouchableOpacity>
          {this.props.topics && this.props.topics.length > 0 ? this._renderTopics() : null}
        </View>
      </View>
    );
  }

  _handleTitlePress = () => {
    this.props.handleTitlePress(this.props.collection)
  }

  _handleUserPress = () => {
    this.props.handleUserPress(this.props.user)
  }

  _handleTopicPress = (topic) => {
    this.props.handleTopicPress(topic)
  }

  _renderRow = (row, sectionID, rowID) => {
    const imageUri = getImageUri(row.media.url)
    const index = parseInt(rowID) + 1
    return (
      <TouchableOpacity
        activeOpacity={.85}
        onPress={() => this._handleRowPress(index)}
        onLongPress={() => this._handleRowLongPress(index)}
        onPressOut={() => this._handleRowPressOut()}
      >
        <View
          style={[styles.recommendation, {borderLeftWidth: index == 1 ? EStyleSheet.hairlineWidth : 0}]}
        >
          <FadeIn
            placeholderStyle={styles.recommendationImageFadeIn}
          >
            <Image
              style={styles.recommendationImage}
              source={{uri: imageUri}}
            />
          </FadeIn>
          { index == this.state.gridCellCount && this.state.recommendationCount > MAX_GRID_CELLS ? this._renderCellNumber() : null }
        </View>
      </TouchableOpacity>
    )
  }

  _handleRowPress = (index) => {
    if (index == this.state.gridCellCount && this.state.recommendationCount > MAX_GRID_CELLS) {
      let recommendations = this.props.recommendations.slice()
      let recommendationToUpdate = {
        ...recommendations[MAX_GRID_CELLS - 1],
      }
      recommendations.splice(MAX_GRID_CELLS - 1, 1, recommendationToUpdate)
      const dataSource = this.state.dataSource.cloneWithRows(recommendations)
      this.setState({
        dataSource: dataSource,
        gridCellCount: this.state.recommendationCount + 1,
      })
    } else {
      this.props.handleProductPress(this.props.collection, index)
    }
  }

  _handleRowLongPress = (index) => {
    const product = this.props.recommendations[index - 1]
    this.props.handleProductLongPress(product)
  }

  _handleRowPressOut = () => {
    this.props.handleProductPressOut()  
  }

  _renderTopics = () => {
    return (
      <View style={styles.collectionListItemDetailsSection}>
        {this.props.topics.slice(0, 2).map(topic =>
          <TouchableOpacity
            key={topic.id}
            activeOpacity={.85}
            style={styles.collectionTopic}
            onPress={() => this._handleTopicPress(topic)}
          >
            <Text style={styles.collectionTopicText}>#{topic.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  _renderCellNumber = () => {
    const text = this.state.recommendationCount - this.state.gridCellCount
    return (
      <View
        style={styles.recommendationNumber}
      >
        <Text style={styles.recommendationNumberText}>+{text}</Text>
      </View>
    )
  }
}

const styles = EStyleSheet.create({
  collectionListItem: {
    alignItems: 'flex-start',
    backgroundColor: Colors.whiteColor,
    marginBottom: 25,
  },
  collectionListItemHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '100%',
  },
  collectionListItemTitle: {
    color: Colors.blackColor,
    flex: 9,
    fontSize: 17,
    fontWeight: '600',
  },
  collectionLikeCount: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  collectionLikeCountText: {
    color: Colors.grayColor,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 5,
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
  recommendationGrid: {
    width: '100%',
    borderColor: Colors.borderColor,
    borderTopWidth: EStyleSheet.hairlineWidth,
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  recommendation: {
    alignItems: 'center',
    borderColor: Colors.borderColor,
    borderRightWidth: EStyleSheet.hairlineWidth,
    justifyContent: 'center',
    padding: 20,
  },
  recommendationImageFadeIn: {
    backgroundColor: Colors.placeholderColor,
    borderRadius: 4,
  },
  recommendationImage: {
    height: recommendationImageSize,
    width: recommendationImageSize,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  recommendationNumber: {
    alignItems: 'center',
    backgroundColor: Colors.whiteColorAlpha,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  recommendationNumberText: {
    backgroundColor: 'transparent',
    color: Colors.collectionTextColor,
    fontSize: 25,
    fontWeight: '500',
  },
  collectionTopic: {
    backgroundColor: Colors.topicBackgroundColor,
    borderColor: '#e8e8e8',
    borderRadius: 4,
    borderWidth: EStyleSheet.hairlineWidth,
    marginLeft: 5,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  collectionTopicText: {
    color: Colors.topicTextColor,
    fontSize: 12,
    fontWeight: '400',
  },
});

module.exports = CollectionListItem;