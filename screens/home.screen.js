import React from 'react';
import {
  Dimensions,
  ListView,
  Modal,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { PulseIndicator } from 'react-native-indicators';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';
import Sizes from '../constants/sizes';
import { getImageUri } from '../utils';
import HomeHeader from '../components/home-header';
import CollectionListItem from '../components/list-items/collection-list-item';
import ImagePreviewModal from '../components/image-preview-modal';

const {height} = Dimensions.get('window');
const collectionListHeight = height - Sizes.headerBarHeight - Sizes.tabBarHeight;

@inject('homeStore') @observer
export default class HomeScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      productPreview: null,
    }
  }

  componentDidMount () {
    this.props.homeStore.getCollections()
  }

  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          animated={true}
        />
        {this._renderHomeHeader()}
        {this._renderListView()}
        {this.state.productPreview ? this._renderImagePreviewModal() : null}
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

  _renderListView = () => {
    let markup
    if (this.props.homeStore.loading) {
      markup = (
        <PulseIndicator color={Colors.blackColor} />
      )
    } else {
      markup = (
        <ListView
          dataSource={this.props.homeStore.collectionsDataSource}
          enableEmptySections={true}
          initialListSize={3}
          ref={(listView) => this.listView = listView}
          renderRow={this._renderRow}
          style={[styles.collectionList, {height: collectionListHeight}]}
        />
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
        handleProductPress={this._handleProductPress.bind(this)}
        handleTitlePress={this._handleTitlePress.bind(this)}
        handleUserPress={this._handleUserPress.bind(this)}
        handleTopicPress={this._handleTopicPress.bind(this)}
        handleProductLongPress={this._handleProductLongPress.bind(this)}
        handleProductPressOut={this._handleProductPressOut.bind(this)}
      />
    )
  }

  _renderImagePreviewModal = () => {
    const imageUri = getImageUri(this.state.productPreview.media.url)
    return (
      <ImagePreviewModal
        title={this.state.productPreview.name}
        imageUri={imageUri}
      />
    )
  }

  _handleOnPressTopic = (topic) => {
    this.props.homeStore.setActiveTopic(topic)
    this.props.homeStore.getCollections()
  }

  _handleProductPress (collection, index) {
    this.props.navigation.navigate('CollectionDetails', {collection: collection, index: index})
  }

  _handleTitlePress (collection) {
    this.props.navigation.navigate('CollectionDetails', {collection: collection})
  }

  _handleUserPress (user) {
    this.props.navigation.navigate('UserDetails', {user: user})
  }

  _handleTopicPress (topic) {
    this.props.navigation.navigate('TopicDetails', {topic: topic})
  }

  _handleProductLongPress = (product) => {
    this.setState({productPreview: product})
  }

  _handleProductPressOut = () => {
    this.setState({productPreview: null})
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  collectionList: {
    width: '100%',
  },
});
