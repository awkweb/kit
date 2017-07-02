import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

import Colors from '../constants/colors';
import HomeScreen from '../screens/home.screen';
import SearchScreen from '../screens/search.screen';
import CollectionDetailsScreen from '../screens/collection-details.screen';

const headerStyle = {
  backgroundColor: Colors.whiteColor,
  borderBottomColor: Colors.tabBarBorder,
  borderBottomWidth: StyleSheet.hairlineWidth,
  shadowOpacity: 0,
}

const HomeTab = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
      path: '/',
      navigationOptions: ({navigation}) => ({
        headerStyle,
      }),
    },
    CollectionDetails: {
      screen: CollectionDetailsScreen,
      path: '/collection/:id',
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const SearchTab = StackNavigator(
  {
    Search: {
      screen: SearchScreen,
      path: '/',
      navigationOptions: ({navigation}) => ({
        headerStyle
      }),
    },
    CollectionDetails: {
      screen: CollectionDetailsScreen,
      path: '/collection/:id',
    },
  },
  {
    initialRouteName: 'Search',
  },
);

export default {
  HomeTab,
  SearchTab,
};
