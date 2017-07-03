import React from 'react';
import { 
  Animated,
  Dimensions,
  ListView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { Ionicons } from '@expo/vector-icons';
import { PulseIndicator } from 'react-native-indicators';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';
import Sizes from '../constants/sizes';
import CollectionListItem from '../components/list-items/collection-list-item';
import UserListItem from '../components/list-items/user-list-item';

const {height} = Dimensions.get('window');
const resultsListHeight = height - Sizes.headerBarHeight - Sizes.searchTypeContainerHeight - Sizes.tabBarHeight;

@inject('searchStore') @observer
export default class Search extends React.Component {
  static navigationOptions = {
  };

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      showTrending: true,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
        />
        <Animated.View
          style={styles.searchContainer}
        >
          <View
            style={styles.searchAppBar}
          >
            <Ionicons
              name={'ios-search'}
              size={20}
              color={Colors.grayColor}
            />
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              clearButtonMode={'always'}
              onChangeText={(query) => this.setState({query})}
              onSubmitEditing={this._onSearch}
              placeholder={'Search all the kits'}
              placeholderTextColor={Colors.headerTextColor}
              returnKeyType={'search'}
              style={styles.searchTextInput}
              value={this.state.query}
            />
          </View>
        </Animated.View>

        {!this.state.showTrending && !this.props.searchStore.loading ? this._renderSearchTypes() : null}
        {this._renderListView()}
      </View>
    );
  }

  _renderListView = () => {
    let markup
    if (this.props.searchStore.loading) {
      markup = (
        <PulseIndicator color={Colors.blackColor} />
      )
    } else if (this.state.showTrending) {
      markup = this._renderTrendingTermsListView()
    } else {
      markup = (
        <ListView
          dataSource={this.props.searchStore.searchResultsDataSource}
          enableEmptySections={true}
          initialListSize={this.props.searchStore.searchResultsDataSource.length / 2}
          ref={(listView) => this.listView = listView}
          renderRow={this._renderRow}
          style={[styles.resultsList, {height: resultsListHeight}]}
        />
      )
    }
    return markup
  }

  _renderRow = (rowData) => {
    let markup
    if (this.props.searchStore.activeSearchType === 'kits') {
      markup = (
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
    } else {
      markup = (
        <UserListItem
          user={rowData}
          handleUserPress={this._handleCollectionListItemUserPress.bind(this)}
        />
      )
    }
    return markup
  }

  _handleSearchTypePress (searchTypeName) {
    if (this.props.searchStore.activeSearchType !== searchTypeName) {
      this.listView.scrollTo({x: 0, y: 0, animated: false})
      this.props.searchStore.setActiveSearchType(searchTypeName)
    }
  }

  _handleCollectionListItemTitlePress (collection) {
    this.props.navigation.navigate('CollectionDetails', {collection: collection})
  }

  _handleCollectionListItemUserPress (user) {
    this.props.navigation.navigate('UserDetails', {user: user})
  }

  _onSearch = () => {
    if (this.state.query.length > 1) {
      this.setState({showTrending: false})
      this.props.searchStore.searchCollections(this.state.query)
    }
  }

  _renderSearchTypes = () => {
    return (
      <View
        style={styles.searchTypeContainer}
      >
        {Object.keys(this.props.searchStore.searchTypes).map(key => {
          const searchType = this.props.searchStore.searchTypes[key]
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={.85}
              onPress={() => this._handleSearchTypePress(searchType.name)}
              style={styles.searchTypeTextContainer}
            >
              <Text
                style={[
                    styles.searchTypeText,
                    this.props.searchStore.activeSearchType === searchType.name ? styles.searchTypeTextActive : null
                  ]}
                >
                  {`${searchType.name.toUpperCase()} (${searchType.results.length})`}
                </Text>
            </TouchableOpacity>
          )}
        )}
      </View>
    )
  }

  _renderTrendingTermsListView = () => {
    return (
      <ListView
        contentContainerStyle={styles.trendingTermsList}
        dataSource={this.props.searchStore.trendingTermsDataSource}
        enableEmptySections={true}
        removeClippedSubviews={false}
        initialListSize={5}
        renderHeader={this._renderTrendingTermsHeader}
        renderRow={this._renderTrendingTermsRow}
      />
    )
  }

  _renderTrendingTermsRow = (rowData) => {
    return (
      <TouchableOpacity
        key={rowData.id}
        activeOpacity={.85}
        onPress={() => this._handleTrendingTermPress(rowData)}
      >
        <Text style={styles.trendingTermsListRowText}>{rowData.name}</Text>  
      </TouchableOpacity>
    )
  }

  _renderTrendingTermsHeader = () => {
    return (
      <Text style={styles.trendingTermsListTitle}>TRENDING</Text>
    )
  }

  _handleTrendingTermPress (rowData) {
    this.setState({query: rowData.name})
    setTimeout(() => this._onSearch(), 0)
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  searchContainer: {
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
  searchAppBar: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  searchTextInputContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  searchTextInput: {
    color: Colors.blackColor,
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 10,
  },
  searchTypeContainer: {
    alignItems: 'center',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: EStyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: Sizes.searchTypeContainerHeight,
    justifyContent: 'space-around',
  },
  searchTypeTextContainer: {
    alignItems: 'center',
    flex: 1,
    height: Sizes.searchTypeContainerHeight,
    justifyContent: 'center',
  },
  searchTypeText: {
    color: Colors.headerTextColor,
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  searchTypeTextActive: {
    color: Colors.blackColor,
  },
  trendingTermsList: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  trendingTermsListTitle: {
    color: Colors.headerTextColor,
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  trendingTermsListRowText: {
    backgroundColor: 'transparent',
    color: Colors.blackColor,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resultsList: {
    width: '100%',
  },
});
