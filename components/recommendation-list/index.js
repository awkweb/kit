import React from 'react';
import {
  ListView,
  Text,
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
        ref={(listView) => this.listView = listView}
        renderFooter={this._renderFooter}
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
      markup = (
        <View
          style={styles.recommendationListHeader}
        >
          <Text style={styles.recommendationListHeaderText}>{this.props.description}</Text>
        </View>
      )
    }
    return markup
  }

  _renderTopics = () => {
    return (
      <View style={styles.collectionListItemDetailsSection}>
        {this.props.topics.slice(0, 2).map(topic =>
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

  _renderFooter () {
    return (
      <View style={styles.recommendationListFooter}>
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
    borderColor: Colors.grayColor,
    borderBottomWidth: EStyleSheet.hairlineWidth,
    width: '100%',
  },
  recommendationListHeaderText: {
    paddingHorizontal: 10,
    paddingVertical: 25,
    fontSize: 16,
  },
  recommendationListFooter: {
    backgroundColor: Colors.whiteColor,
    height: 10,
    width: '100%',
  },
});

module.exports = RecommendationList;