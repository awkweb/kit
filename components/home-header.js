import React from 'react';
import {
  Animated,
  ListView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import Colors from '../constants/colors';
import Logo from './logo';

export default class HomeHeader extends React.Component {
  constructor (props) {
    super(props)

  }

  render () {
    return (
      <Animated.View
        style={styles.container}
      >
        <View
          style={styles.appBar}
        >
          <Logo
            style={styles.logo}
          />
          
          {this._renderTopicsListView()}
        </View>
      </Animated.View>
    );
  }

  _renderTopicsListView = () => {
    return (
      <ListView
        dataSource={this.props.topics}
        horizontal={true}
        renderRow={this._renderTopicRow}
        showsHorizontalScrollIndicator={false}
        style={styles.topicsListView}
        contentContainerStyle={styles.topicsContentContainer}
      />
    )
  }

  _renderTopicRow = (rowData, sectionId, rowId) => {
    const activeStyle = rowData.active ? styles.topicRowTextActive : null
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this._handleOnPressTopic(rowData)}
        style={styles.topicRow}   
      >
        <Text style={[styles.topicRowText, activeStyle]}>{rowData.name}</Text>
      </TouchableOpacity>
    )
  }

  _handleOnPressTopic = (rowData) => {
    this.props.onPressTopic(rowData)
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.header,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.headerBorder,
    height: 64,
    paddingTop: 20,
    shadowOpacity: 0,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  appBar: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  logo: {
    marginRight: 10,
  },
  topicsListView: {
    height: 44,
    paddingLeft: 15,
  },
  topicsContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  topicRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    marginRight: 20,
  },
  topicRowText: {
    color: Colors.headerTextColor,
    fontSize: 14,
    fontWeight: '500',
  },
  topicRowTextActive: {
    color: Colors.headerTextColorActive,
  },
});

module.exports = HomeHeader;