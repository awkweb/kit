import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import Display from 'react-native-display';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';
import HomeHeader from '../components/home-header';
import CollectionList from '../components/collection-list';

@inject('homeStore') @observer
export default class HomeScreen extends React.Component {
  static navigationOptions = {
  };

  componentDidMount () {
    this.props.homeStore.getCollections()
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderHomeHeader()}
  
        <Display
          enable={!this.props.homeStore.loading}
          enterDuration={250} 
          exitDuration={250}
          exit="fadeOut"
          enter="fadeIn"
        >
          <CollectionList
            dataSource={this.props.homeStore.collectionsDataSource}
            handleCollectionListItemTitlePress={this._handleCollectionListItemTitlePress.bind(this)}
            handleCollectionListItemUserPress={this._handleCollectionListItemUserPress.bind(this)}
          />
        </Display>
      </View>
    );
  }

  _renderHomeHeader = () => {
    return (
      <HomeHeader
        topics={this.props.homeStore.topicsDataSource}
        onPressTopic={this._handleOnPressTopic.bind(this)}
      />
    )
  }

  _handleOnPressTopic = (topic) => {
    this.props.homeStore.setActiveTopic(topic)
    this.props.homeStore.getCollections()
  }

  _handleCollectionListItemTitlePress (collection) {
    this.props.navigation.navigate('CollectionDetails', {collection: collection})
  }

  _handleCollectionListItemUserPress (user) {
    alert(user.username)
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
