import Expo from 'expo';
import React from 'react';
import {
  Text,
  View
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../constants/colors';

export default class ExpertBadge extends React.Component {
  render () {
    return (
      <View
        style={[styles.container, this.props.style]}
      >
        <View
          style={styles.expertBadge}
        >
          <FontAwesome
            name={"star"}
            size={12}
            color={Colors.whiteColor}
          />
        </View>
        {this.props.description ? <Text style={styles.expertBadgeText}>{this.props.description}</Text> : null}
      </View>
    )
  }
}

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
  },
  $EXPERT_BADGE_SIZE: 18,
  expertBadge: {
    alignItems: 'center',
    backgroundColor: Colors.goldColor,
    borderRadius: '0.5 * $EXPERT_BADGE_SIZE',
    height: '$EXPERT_BADGE_SIZE',
    justifyContent: 'center',
    width: '$EXPERT_BADGE_SIZE',
  },
  expertBadgeText: {
    color: Colors.goldColor,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 5,
  },
});

module.exports = ExpertBadge;