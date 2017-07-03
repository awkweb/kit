import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../../constants/colors';
import { getUserFullName } from '../../utils';
import UserAvatar from '../user-avatar';
import ExpertBadge from '../expert-badge';

const AVATAR_SIZE = 80;

export default class UserListItem extends React.Component {
  render () {
    const user = this.props.user
    const userFullName = getUserFullName(user)
    return (
      <TouchableOpacity
        activeOpacity={.85}
        onPress={this._handleUserPress}
        style={styles.userListItem}
      >
        <View
          style={styles.userListItemContainer}
        >
          <View
            style={styles.userAvatarContainer}
          >
            <UserAvatar
              user={user}
              avatarSize={AVATAR_SIZE}
            />
            {user.showcaseInfo.authorityBadge ? <ExpertBadge style={styles.expertBadge} /> : null}
          </View>

          <View
            style={styles.userInfoContainer}
          >
            {userFullName.length > 0 ? <Text style={styles.userFullNameText}>{userFullName}</Text> : null}
            <Text style={styles.userUsernameText}>@{user.username}</Text>
            {user.bio ? <Text style={styles.userBioText}>{user.bio}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _handleUserPress = () => {
    this.props.handleUserPress(this.props.user)
  }
}

const styles = EStyleSheet.create({
  userListItem: {
    backgroundColor: Colors.whiteColor,
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: EStyleSheet.hairlineWidth,
  },
  userListItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  userAvatarContainer: {
    alignItems: 'center',
    borderColor: Colors.whiteColor,
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  expertBadge: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userFullNameText: {
    color: Colors.blackColor,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'transparent',
    marginBottom: 3,
  },
  userUsernameText: {
    backgroundColor: 'transparent',
    color: Colors.headerTextColor,
    fontSize: 13,
    fontWeight: '400',
  },
  userBioText: {
    backgroundColor: 'transparent',
    color: Colors.blackColor,
    fontSize: 13,
    fontWeight: '400',
    marginTop: 5,
  },
});

module.exports = UserListItem;