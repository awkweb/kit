import React from 'react';
import {
  Image,
  ListView,
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
  static navigationOptions = {
  };

  constructor (props) {
    super(props)
    const userStore = new UserStore();
    const user = props.navigation.state.params.user
    userStore.setUser(user)
    const coverImageSource = user.media.coverImageUrl ? {uri: getImageUri(user.media.coverImageUrl)} : require('../assets/images/cover.jpg')
    this.state = {userStore, coverImageSource, user}
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
              name={"ios-arrow-back"}
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

  _renderListView = () => {
    let markup
    if (this.state.userStore.loading) {
      markup = (
        <PulseIndicator
          color={Colors.blackColor}
          style={styles.pulseIndicator}
        />
      )
    } else if (this.state.userStore.collections.length == 0) {
      const description = `@${this.state.user.username} hasn't created any kits.`
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
      />
    )
  }

  _handleCollectionListItemTitlePress (collection) {
    this.props.navigation.navigate('CollectionDetails', {collection: collection})
  }

  _handleCollectionListItemUserPress (user) {
    this.props.navigation.navigate('UserDetails', {user: user})
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
    const userFullName = getUserFullName(this.state.user)
    return (
      <Animatable.View
        style={styles.fixedForegroundContainer}
        ref={(navTitleView) => { this.navTitleView = navTitleView; }}
      >
        {userFullName.length > 0 ? <Text style={styles.fixedForegroundTitle}>{userFullName}</Text> : null}
        <Text style={styles.fixedForegroundUsername}>@{this.state.user.username}</Text>
      </Animatable.View>
    )
  }

  _renderForeground () {
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
        
        <Text style={styles.foregroundTitle}>{`${this.state.user.firstname} ${this.state.user.lastname}`}</Text>
        <Text style={styles.foregroundUsername}>@{this.state.user.username}</Text>
        
        {this.state.user.bio ? <Text style={styles.foregroundBio}>{this.state.user.bio}</Text> : null}
      </View>
    )
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
  fixedForegroundAvatar: {
    backgroundColor: 'transparent',
    right: 10,
    position: 'absolute',
    top: 25,
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
    marginBottom: 3,
  },
  foregroundUsername: {
    backgroundColor: 'transparent',
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
