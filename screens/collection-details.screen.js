import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';

export default class CollectionDetails extends React.Component {
  static navigationOptions = {
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>CollectionDetails</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
