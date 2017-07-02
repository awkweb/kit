import React from 'react';
import { action, computed, observable } from 'mobx';
import { ListView } from 'react-native';
import axios from 'axios'

import api from '../api'

export default class SearchStore {
  @observable searchResults = []
  @observable loading = false

  @computed get searchResultsDataSource () {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    return dataSource.cloneWithRows(this.searchResults.slice())
  }

  @action getSearchResults = (query) => {
    this.loading = true
  	api.search(query)
  		.then(res => {
        const collections = res.data.hits.hits
        let collectionsLookup = {}
        collections.forEach(c => collectionsLookup[`${c._source.id}`] = c._source )
        const maxCollections = Math.min(collections.length, 10)
        const promises = collections.slice(0, maxCollections).map(collection => api.recommendations(collection._source.id))
        axios.all(promises)
          .then(res2 => {
            let searchResults = []
            res2.forEach(x => {
              const recommendations = x.data
              if (recommendations.length > 0) {
                const collectionId = recommendations[0].collection.id
                let collection = collectionsLookup[collectionId]
                collection.recommendations = recommendations
                searchResults.push(collection)
              }
            })
            this.searchResults = searchResults
            this.loading = false
          })
          .catch(err2 => {
            console.log(err2)
            this.loading = false
          })
  		})
  		.catch(err => console.log(err))
  }
}