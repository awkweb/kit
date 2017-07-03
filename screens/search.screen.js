import React from 'react';
import { 
  StatusBar,
  Text,
  View
} from 'react-native';
import { inject, observer } from 'mobx-react';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';

@inject('searchStore') @observer
export default class Search extends React.Component {
  static navigationOptions = {
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
        />
        <Text>Search</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
});
