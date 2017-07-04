import React from 'react';
import { action, computed, observable } from 'mobx';
import { ListView } from 'react-native';
import axios from 'axios'

import api from '../api'

const MAX_RESULTS = 20

export default class SearchStore {
  constructor() {
    this.activeSearchType = 'kits'
  }

  @observable activeSearchType = undefined
  @observable searchTypes = {
    kits: { name: 'kits', active: true, results: [] },
    people: { name: 'people', active: false, results: [] },
  }
  @observable trendingTerms = [
    { id: 1, name: 'books in 2017' },
    { id: 2, name: 'camera gear' },
    { id: 3, name: 'travel' },
    { id: 4, name: 'summer' },
    { id: 5, name: 'tea' },
  ]
  @observable loading = false

  @computed get trendingTermsDataSource () {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    return dataSource.cloneWithRows(this.trendingTerms.slice())
  }

  @computed get searchResultsDataSource () {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    return dataSource.cloneWithRows(this.searchTypes[this.activeSearchType].results.slice())
  }

  @action setActiveSearchType = (searchType) => {
    this.activeSearchType = searchType
  }

  @action searchCollections = (query) => {
    this.loading = true
    axios.all([api.searchUsers(query), api.searchCollections(query)])
      .then(axios.spread((userRes, collectionRes) => {
        const users = userRes.data.hits.hits
        this.searchTypes.people.results = users.slice(0, MAX_RESULTS).map(u => u._source)

        const collections = collectionRes.data.hits.hits
        if (collections.length == 0) {
          this.searchTypes.kits.results = []
          this.loading = false    
          return
        }
        let collectionsLookup = {}
        const maxCollections = Math.min(collections.length, MAX_RESULTS)
        collections.slice(0, maxCollections).forEach(c => collectionsLookup[`${c._source.id}`] = c._source)
        const collectionIds = Object.keys(collectionsLookup)
        api.collectionLikes(collectionIds)
          .then(res => {
            const collectionLikes = res.data
            const topicPromises = collectionIds.map(collectionId => api.collectionTopics(collectionId))
            axios.all(topicPromises)
              .then(res2 => {
                let collectionTopicsLookup = {}
                res2.forEach((t, i) => {
                  const topics = t.data
                  if (topics.length > 0) {
                    collectionTopicsLookup[`${collectionIds[i]}`] = topics
                  }
                })
                const recommendationPromises = collectionIds.map(collectionId => api.recommendations(collectionId))
                axios.all(recommendationPromises)
                  .then(res3 => {
                    let collectionSearchResults = []
                    res3.forEach(x => {
                      const recommendations = x.data
                      if (recommendations.length > 0) {
                        const collectionId = recommendations[0].collection.id
                        let collection = collectionsLookup[collectionId]
                        collection = {
                          ...collection,
                          recommendations: recommendations,
                          likes: collectionLikes[collectionId],
                          topics: collectionTopicsLookup[collectionId],
                        }
                        collectionSearchResults.push(collection)
                      }
                    })
                    this.searchTypes.kits.results = collectionSearchResults
                    this.loading = false
                  })
                  .catch(err4 => {
                    this.loading = false
                  })
              })
              .catch(err3 => {
                this.loading = false
              })
          })
          .catch(err2 => {
            this.loading = false
          })
      }))
      .catch(err => {
        this.loading = false
      })    
  }
}