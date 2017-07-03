import React from 'react';
import { AppLoading } from 'expo';
import { Provider } from 'mobx-react';
import EStyleSheet from 'react-native-extended-stylesheet';

import Navigator from './navigator';
import cacheAssetsAsync from './utils/cache-assets-async';
import HomeStore from './stores/home.store';
import SearchStore from './stores/search.store';

const homeStore = new HomeStore();
const searchStore = new SearchStore();

export default class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/avatar.png')],
        fonts: [
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    console.disableYellowBox = true;
    if (this.state.appIsReady) {
      return (
        <Provider
          style={styles.container}
          homeStore={homeStore}
          searchStore={searchStore}
        >
          <Navigator />
        </Provider>
      );
    } else {
      return <AppLoading />
    }
  }
}

EStyleSheet.build();
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
