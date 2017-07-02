import React from 'react';
import { ListView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CollectionListItem from './collection-list-item';

export default class CollectionList extends React.Component {
  componentWillReceiveProps (nextProps) {
    this.listView.scrollTo({x: 0, y: 0, animated: false})
  }

  render () {
    return (
      <ListView
        dataSource={this.props.dataSource}
        enableEmptySections={true}
        initialListSize={this.props.dataSource.length}
        ref={(listView) => this.listView = listView}
        renderRow={this._renderRow}
        style={styles.collectionList}
      />
    );
  }

  _renderRow = (rowData) => {
    return (
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
  }

  _handleCollectionListItemTitlePress (collection) {
    this.props.handleCollectionListItemTitlePress(collection)
  }

  _handleCollectionListItemUserPress (user) {
    this.props.handleCollectionListItemUserPress(user)
  }
}

const styles = EStyleSheet.create({
  collectionList: {
    width: '100%',
    height: '100% - 104',
  },
});

module.exports = CollectionList;