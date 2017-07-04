import React from 'react';
import { action, computed, observable } from 'mobx';
import { ListView } from 'react-native';
import axios from 'axios'

import api from '../api'

const MAX_RESULTS = 20

export default class UserStore {
  @observable user = undefined
  @observable collections = []
  @observable loading = false

  @computed get collectionsDataSource () {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    const collections = this.collections.slice()
    return dataSource.cloneWithRows(collections)
  }

  @action setUser (user) {
    this.user = user
  }

  @action getCollections = () => {
    this.loading = true
  	api.userCollections(this.user.id)
  		.then(res => {
        const collections = res.data
        let collectionsLookup = {}
        const maxCollections = Math.min(collections.length, MAX_RESULTS)
        collections.slice(0, maxCollections).forEach(c => collectionsLookup[`${c.id}`] = c)
        const collectionIds = Object.keys(collectionsLookup)
        api.collectionLikes(collectionIds)
          .then(res2 => {
            const collectionLikes = res2.data
            const topicPromises = collectionIds.map(collectionId => api.collectionTopics(collectionId))
            axios.all(topicPromises)
              .then(res3 => {
                let collectionTopicsLookup = {}
                res3.forEach((t, i) => {
                  const topics = t.data
                  if (topics.length > 0) {
                    collectionTopicsLookup[`${collectionIds[i]}`] = topics
                  }
                })
                const recommendationPromises = collectionIds.map(collectionId => api.recommendations(collectionId))
                axios.all(recommendationPromises)
                  .then(res4 => {
                    let collectionResults = []
                    res4.forEach(x => {
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
                        collectionResults.push(collection)
                      }
                    })
                    this.collections = collectionResults
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
        })
      .catch(err => {
        this.loading = false
      })     
  }
}