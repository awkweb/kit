import React from 'react';
import { ListView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import CollectionListItem from './collection-list-item';

export default class CollectionList extends React.Component {
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
        recommendations={rowData.recommendations}
        user={rowData.owner}
        handleOnPress={this._handleOnPress.bind(this)}
      />
    )
  }

  _handleOnPress (collection) {
    this.props.handleCollectionListItemPress(collection)
  }
}

const styles = EStyleSheet.create({
  collectionList: {
    width: '100%',
  },
});

module.exports = CollectionList;