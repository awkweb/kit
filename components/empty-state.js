import React from 'react';
import {
  Text,
  View
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';

export default class EmptyState extends React.Component {
  render () {
    return (
      <View style={[styles.emptyState, this.props.style]}>
        <Text style={styles.emptyStateTitle}>{this.props.title}</Text>
        <Text style={styles.emptyStateTitleDescription}>{this.props.description}</Text>
      </View>
    )
  }
}

const styles = EStyleSheet.create({
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  emptyStateTitle: {
    backgroundColor: 'transparent',
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyStateTitleDescription: {
    backgroundColor: 'transparent',
    color: Colors.blackColor,
    fontSize: 12,
    fontWeight: '400',
  },
});

module.exports = EmptyState;