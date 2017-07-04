import React from 'react';
import {
  ListView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../../constants/colors';
import RecommendationListItem from './recommendation-list-item';

export default class RecommendationList extends React.Component {
  render () {
    return (
      <ListView
        dataSource={this.props.dataSource}
        enableEmptySections={true}
        initialListSize={5}
        removeClippedSubviews={false}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        style={styles.recommendationList}
      />
    );
  }

  _renderRow = (rowData) => {
    return (
      <RecommendationListItem
        name={rowData.name}
        description={rowData.description}
        imageUri={rowData.media.url}
        retailerName={rowData.availability.retailer.name}
        url={rowData.availability.url}
      />
    )
  }

  _renderHeader = () => {
    let markup
    if (this.props.description) {
      const headerTextUser = this.props.user.firstname ? this.props.user.firstname : `@${this.props.user.username}`
      markup = (
        <View
          style={styles.recommendationListHeader}
        >
          <Text>
            <Text style={styles.recommendationListHeaderTextUser}>{headerTextUser} says: </Text>
            <Text style={styles.recommendationListHeaderTextDescription}>{this.props.description}</Text>
          </Text>
          {this.props.topics && this.props.topics.length > 0 ? this._renderTopics() : null}
        </View>
      )
    }
    return markup
  }

  _renderTopics = () => {
    return (
      <View
        style={styles.collectionTopicContainer}
      >
        {this.props.topics.map(topic =>
          <TouchableOpacity
            key={topic.id}
            activeOpacity={.85}
            style={styles.collectionTopic}
          >
            <Text style={styles.collectionTopicText}>#{topic.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = EStyleSheet.create({
  recommendationList: {
    backgroundColor: Colors.whiteColor,
    width: '100%',
  },
  recommendationListHeader: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: '100%',
  },
  recommendationListHeaderTextUser: {
    color: Colors.collectionTextColor,
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationListHeaderTextDescription: {
    color: Colors.collectionTextColor,
    fontSize: 14,
  },
  collectionTopicContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  collectionTopic: {
    backgroundColor: Colors.topicBackgroundColor,
    borderColor: '#e8e8e8',
    borderRadius: 4,
    borderWidth: EStyleSheet.hairlineWidth,
    marginRight: 5,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  collectionTopicText: {
    color: Colors.topicTextColor,
    fontSize: 12,
    fontWeight: '400',
  },
});

module.exports = RecommendationList;