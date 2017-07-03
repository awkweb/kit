import React from 'react';
import {
  Image,
  ListView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';

import Colors from '../constants/colors';
import Sizes from '../constants/sizes';
import { getImageUri } from '../utils';
import RecommendationList from '../components/recommendation-list';
import UserAvatar from '../components/user-avatar';

const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = Sizes.headerBarHeight;

export default class CollectionDetails extends React.Component {
  static navigationOptions = {
  };

  constructor (props) {
    super(props)
    const collection = props.navigation.state.params.collection
    const products = collection.recommendations.slice()
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      collection: collection,
      dataSource: dataSource.cloneWithRows(products),
      imageUri: getImageUri(collection.portraitSocialImage.url),
      title: collection.name,
      navTitle: collection.name.length > 28 ? `${collection.name.slice(0, 25).trim()}...` : collection.name,
      user: collection.owner,
      itemCount: products.length,
      description: collection.description,
      topics: collection.topics,
    }
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
              <RecommendationList
                dataSource={this.state.dataSource}
                user={this.state.user}
                description={this.state.description}
                topics={this.state.topics}
              />
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

  _handleUserPress = () => {
    this.props.navigation.navigate('UserDetails', {user: this.state.user})
  }

  _renderHeader () {
    return (
      <Image
        source={{uri: this.state.imageUri}}
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
        <Text style={styles.fixedForegroundTitle}>{this.state.navTitle}</Text>
        <Text style={styles.fixedForegroundUsername}>{this.state.itemCount} {this.state.itemCount > 1 ? 'items' : 'item'}</Text>

        <TouchableOpacity
          activeOpacity={.85}
          onPress={this._handleUserPress}
          style={styles.fixedForegroundAvatar}
        >
          <UserAvatar
            user={this.state.user}
            avatarSize={30}
          />
        </TouchableOpacity>
      </Animatable.View>
    )
  }

  _renderForeground () {
    return (
      <View style={styles.foregroundContainer}>
        <Text style={styles.foregroundTitle}>{this.state.title}</Text>

        <TouchableOpacity
          activeOpacity={.85}
          onPress={this._handleUserPress}
        >
          <UserAvatar
            user={this.state.user}
            avatarSize={38}
          />
        </TouchableOpacity>

        <Text style={styles.foregroundUsername}>by @{this.state.user.username}</Text>
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
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  foregroundTitle: {
    color: Colors.whiteColor,
    fontSize: 24,
    fontWeight: '600',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  foregroundUsername: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'transparent',
    marginTop: 5,
  },
});
