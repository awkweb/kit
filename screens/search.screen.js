import React from 'react';
import { 
  StyleSheet,
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
        <Text>Search</Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
