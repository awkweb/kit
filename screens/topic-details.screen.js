import React from 'react';
import {
  Animated,
  Dimensions,
  ListView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import { Ionicons } from '@expo/vector-icons';
import { PulseIndicator } from 'react-native-indicators';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';
import Sizes from '../constants/sizes';
import TopicStore from '../stores/topic.store';
import CollectionListItem from '../components/list-items/collection-list-item';

const {height} = Dimensions.get('window');
const collectionListHeight = height - Sizes.headerBarHeight - Sizes.tabBarHeight;

@observer
export default class TopicDetailsScreen extends React.Component {
  constructor (props) {
    super(props)
    const topicStore = new TopicStore()
    const topic = props.navigation.state.params.topic
    topicStore.setTopic(topic)
    this.state = {topicStore, topic}
  }

  componentDidMount () {
    this.state.topicStore.getCollections()
  }

  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          animated={true}
        />
        {this._renderNavHeader()}
        {this._renderListView()}

        <TouchableOpacity
          activeOpacity={.85}
          onPress={this._handleBackButtonPress}
          style={styles.backButton}
        >
          <View>
            <Ionicons
              name={"ios-arrow-back-outline"}
              size={32}
              color={Colors.blackColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderNavHeader = () => {
    return (
      <Animated.View
        style={styles.headerContainer}
      >
        <View
          style={styles.headerAppBar}
        >
          <Text style={styles.headerText}>#{this.state.topic.name}</Text>
        </View>
      </Animated.View>
    )
  }

  _renderListView = () => {
    let markup
    if (this.state.topicStore.loading) {
      markup = (
        <PulseIndicator color={Colors.blackColor} />
      )
    } else {
      markup = (
        <ListView
          dataSource={this.state.topicStore.collectionsDataSource}
          enableEmptySections={true}
          initialListSize={3}
          ref={(listView) => this.listView = listView}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          style={[styles.collectionList, {height: collectionListHeight}]}
        />
      )
    }
    return markup
  }

  _renderHeader = () => {
    let markup
    if (this.state.topic.description) {
      markup = (
        <View
          style={styles.topicListHeader}
        >
          <Text style={styles.topicListHeaderText}>{this.state.topic.description}</Text>
        </View>
      )
    }
    return markup
  }

  _renderRow = (rowData) => {
    return (
      <CollectionListItem
        collection={rowData}
        description={rowData.description}
        name={rowData.name}
        likes={rowData.likes}
        recommendations={rowData.recommendations}
        topics={rowData.topics}
        user={rowData.owner}
        handleTitlePress={this._handleCollectionListItemTitlePress.bind(this)}
        handleUserPress={this._handleCollectionListItemUserPress.bind(this)}
        handleTopicPress={this._handleCollectionListItemTopicPress.bind(this)}
      />
    )
  }

  _handleCollectionListItemTitlePress (collection) {
    this.props.navigation.navigate('CollectionDetails', {collection: collection})
  }

  _handleCollectionListItemUserPress (user) {
    this.props.navigation.navigate('UserDetails', {user: user})
  }

  _handleCollectionListItemTopicPress (topic) {
    this.props.navigation.navigate('TopicDetails', {topic: topic})
  }

  _handleBackButtonPress = () => {
    this.props.navigation.goBack(null)
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  backButton: {
    backgroundColor: 'transparent',
    left: 10,
    position: 'absolute',
    top: 25,
    width: 40,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: Colors.header,
    borderBottomWidth: EStyleSheet.hairlineWidth,
    borderColor: Colors.headerBorder,
    height: 64,
    paddingTop: 20,
    shadowOpacity: 0,
    shadowRadius: EStyleSheet.hairlineWidth,
    shadowOffset: {
      height: EStyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  headerAppBar: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.headerTextColorActive,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  topicListHeader: {
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: '100%',
  },
  topicListHeaderText: {
    color: '#959595',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  collectionList: {
    width: '100%',
  },
});
