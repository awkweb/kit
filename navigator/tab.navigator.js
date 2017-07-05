import React from 'react';
import {
  TabNavigator,
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import StackNavigator from './stack.navigator';

export default TabNavigator(
  {
    Home: {
      screen: StackNavigator.HomeTab,
      path: '/',
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
        title: 'Home',
      },
    },
    Search: {
      screen: StackNavigator.SearchTab,
      path: '/search',
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={focused ? 'ios-search' : 'ios-search-outline'}
            size={26}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
        title: 'Search',
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: Colors.tintColor,
      inactiveTintColor: Colors.tabIconDefault,
      showLabel: true,
      style: {
        backgroundColor: Colors.whiteColor,
        borderTopColor: Colors.tabBarBorder,
      },
    },
  },
);
