import React from 'react';
import {
  Image,
  Linking,
  ListView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { observer } from 'mobx-react';
import { Ionicons } from '@expo/vector-icons';
import { PulseIndicator } from 'react-native-indicators';
import EStyleSheet from 'react-native-extended-stylesheet';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import psl from 'psl';

import Colors from '../constants/colors';
import Sizes from '../constants/sizes';
import UserStore from '../stores/user.store';
import {
  getImageUri,
  getUserFullName
} from '../utils';
import CollectionListItem from '../components/list-items/collection-list-item';
import UserAvatar from '../components/user-avatar';
import ExpertBadge from '../components/expert-badge';
import EmptyState from '../components/empty-state';

const HEADER_MAX_HEIGHT = 285;
const HEADER_MIN_HEIGHT = Sizes.headerBarHeight;

@observer
export default class CollectionDetails extends React.Component {
  constructor (props) {
    super(props)
    const userStore = new UserStore();
    const user = props.navigation.state.params.user
    userStore.setUser(user)
    const coverImageSource = user.media.coverImageUrl ? {uri: getImageUri(user.media.coverImageUrl)} : require('../assets/images/cover.jpg')
    const userFullName = getUserFullName(user)
    this.state = {userStore, coverImageSource, user, userFullName}
  }

  componentDidMount () {
    this.state.userStore.getCollections()
  }

  componentWillReceiveProps (nextProps) {
    this.listView.scrollTo({x: 0, y: 0, animated: false})
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          animated={true}
        />
          
        <HeaderImageScrollView
          maxHeight={HEADER_MAX_HEIGHT}
          minHeight={HEADER_MIN_HEIGHT}
          maxOverlayOpacity={0.7}
          minOverlayOpacity={0.45}
          fadeOutForeground={true}
          renderHeader={() => this._renderHeader()}
          renderFixedForeground={() => this._renderFixedForeground()}
          renderForeground={() => this._renderForeground()}
        >
          <View>
            <TriggeringView
              onBeginHidden={() => this.navTitleView.fadeInUp(300)}
              onDisplay={() => this.navTitleView.fadeOut(100)}
            >
              {this._renderListView()}
            </TriggeringView>
          </View>
        </HeaderImageScrollView>

        <TouchableOpacity
          activeOpacity={.85}
          onPress={this._handleBackButtonPress}
          style={styles.backButton}
        >
          <View>
            <Ionicons
              name={"ios-arrow-back-outline"}
              size={32}
              color={Colors.whiteColor}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={.85}
          onPress={this._handleShareButtonPress}
          style={styles.shareButton}
        >
          <View>
            <Ionicons
              name={"ios-share-outline"}
              size={32}
              color={Colors.whiteColor}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _handleBackButtonPress = () => {
    this.props.navigation.goBack(null)
  }

  _handleShareButtonPress = () => {
    const data = {
      message: `Check out @${this.state.user.username} on Kit!`,
      url: `https://kit.com/${this.state.user.username}`,
    }
    Share.share(data)
  }

  _renderListView = () => {
    let markup
    if (this.state.userStore.loading) {
      markup = (
        <PulseIndicator
          color={Colors.blackColor}
          style={styles.pulseIndicator}
        />
      )
    } else if (this.state.userStore.collections.length == 0 && !this.state.userStore.loading) {
      const description = `@${this.state.user.username} hasn't created any kits yet.`
      markup = (
        <EmptyState
          title={'No kits :('}
          description={description}
          style={styles.emptyState}
        />
      )
    } else {
      markup = (
        <ListView
          dataSource={this.state.userStore.collectionsDataSource}
          enableEmptySections={true}
          initialListSize={this.state.userStore.collectionsDataSource.length / 2}
          ref={(listView) => this.listView = listView}
          renderRow={this._renderRow}
          style={styles.collectionList}
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

  _renderHeader () {
    return (
      <Image
        source={this.state.coverImageSource}
        style={styles.header}
      />
    )
  }

  _renderFixedForeground () {
    return (
      <Animatable.View
        style={styles.fixedForegroundContainer}
        ref={(navTitleView) => { this.navTitleView = navTitleView; }}
      >
        {this.state.userFullName.length > 0 ? <Text style={styles.fixedForegroundTitle}>{this.state.userFullName}</Text> : null}
        <Text style={styles.fixedForegroundUsername}>@{this.state.user.username}</Text>
      </Animatable.View>
    )
  }

  _renderForeground () {
    const hasUrl = this.state.user.url || (this.state.user.userProvidedInfo && this.state.user.userProvidedInfo.url)
    return (
      <View style={styles.foregroundContainer}>
        <View
          style={styles.userAvatarContainer}
        >
          <UserAvatar
            user={this.state.user}
            avatarSize={80}
          />
          {this.state.user.showcaseInfo.authorityBadge ? <ExpertBadge style={styles.expertBadge} /> : null}
        </View>
        
        {this.state.userFullName.length > 0 ? <Text style={styles.foregroundTitle}>{this.state.userFullName}</Text> : null}
        <View
          style={styles.userDetailsContainer}
        >
          <Text style={styles.foregroundUsername}>@{this.state.user.username}</Text>
          {hasUrl ? <Text style={styles.seperator}>•</Text> : null}
          {hasUrl ? this._renderWebLink() : null}
        </View>

        {this.state.user.bio ? <Text style={styles.foregroundBio}>{this.state.user.bio}</Text> : null}
      </View>
    )
  }

  _renderWebLink = () => {
    let url = this.state.user.url ? this.state.user.url : this.state.user.userProvidedInfo.url
    url = url.replace(/http:\/\/|https:\/\/|www./g, '')
    return (
      <TouchableOpacity
        activeOpacity={.85}
        onPress={() => this._handleWebLinkPress(url)}
        style={styles.foregroundWebLink}
      >
        <Text style={styles.foregroundWebLinkText}>{url}</Text>
      </TouchableOpacity>
    )
  }

  _handleWebLinkPress (url) {
    const urlLink = url.replace(/http:\/\/|https:\/\//g, '')
    Linking.openURL(`http://${urlLink}`)
  }
}

const styles = EStyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    left: 10,
    position: 'absolute',
    top: 25,
    width: 40,
  },
  shareButton: {
    backgroundColor: 'transparent',
    right: 10,
    position: 'absolute',
    top: 25,
    width: 20,
  },
  pulseIndicator: {
    marginTop: 40,
  },
  emptyState: {
    marginTop: 40,
  },
  collectionList: {
    width: '100%',
  },
  header: {
    height: HEADER_MAX_HEIGHT,
    width: '100%',
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  fixedForegroundContainer: {
    height: HEADER_MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    opacity: 0,
  },
  fixedForegroundTitle: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
  fixedForegroundUsername: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: '400',
    backgroundColor: 'transparent',
  },
  foregroundContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  userAvatarContainer: {
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    borderRadius: 42,
    borderWidth: 3,
    height: 84,
    justifyContent: 'center',
    marginBottom: 10,
    width: 84,
  },
  expertBadge: {
    position: 'absolute',
    right: 2,
    top: 2,
  },
  foregroundTitle: {
    backgroundColor: 'transparent',
    color: Colors.whiteColor,
    fontSize: 20,
    fontWeight: '600',
  },
  userDetailsContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  seperator: {
    backgroundColor: 'transparent',
    color: Colors.whiteColor,
    fontSize: 13,
    fontWeight: '400',
    marginHorizontal: 5,
  },
  foregroundUsername: {
    backgroundColor: 'transparent',
    color: Colors.whiteColor,
    fontSize: 13,
    fontWeight: '400',
  },
  foregroundWebLink: {
    backgroundColor: 'transparent',
    marginLeft: 3,
  },
  foregroundWebLinkText: {
    color: Colors.whiteColor,
    fontSize: 13,
    fontWeight: '400',
  },
  foregroundBio: {
    backgroundColor: 'transparent',
    color: Colors.whiteColor,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    paddingHorizontal: 15,
  },
});
