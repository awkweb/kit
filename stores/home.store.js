import React from 'react';
import { action, computed, observable } from 'mobx';
import { ListView } from 'react-native';
import axios from 'axios'

import api from '../api'

const MAX_RESULTS = 20

export default class HomeStore {
  constructor() {
    this.activeTopicId = 'trending'
  }

  @observable activeTopicId = undefined
  @observable topics = [
    { id: 'for-you', name: 'For You', active: false },
    { id: 'trending', name: 'Trending', active: true },
    { id: 'new', name: 'New', active: false },
    { id: 'staff', name: 'Staff Picks', active: false },
    { id: '3', name: '#burningman', active: false },
    { id: '55', name: '#coffee', active: false },
    { id: '1', name: '#edc', active: false },
    { id: '8', name: '#health', active: false },
    { id: '34', name: '#filmgear', active: false },
    { id: '68', name: '#food', active: false },
    { id: '18', name: '#pets', active: false },
    { id: '23', name: '#summer', active: false },
    { id: '5', name: '#travel', active: false },
    { id: '61', name: '#tea', active: false },
  ]
  @observable collections = []
  @observable loading = false

  @computed get topicsDataSource () {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    const topics = this.topics.slice()
    return dataSource.cloneWithRows(topics)
  }

  @computed get collectionsDataSource () {
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    const collections = this.collections.slice()
    return dataSource.cloneWithRows(collections)
  }

  @action setActiveTopic = (topic) => {
    this.activeTopicId = topic.id
    this.topics = this.topics.map(t => {
      if (t.active) {
        t.active = false
      }
      if (t.id === topic.id) {
        t.active = true
      }
      return t
    })
  }

  @action getCollections = () => {
    this.loading = true
  	api.topics(this.activeTopicId)
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
                    this.collections = res4.map(x => {
                      const recommendations = x.data
                      const collectionId = recommendations[0].collection.id
                      let collection = collectionsLookup[collectionId]
                      collection = {
                        ...collection,
                        recommendations: recommendations,
                        likes: collectionLikes[collectionId],
                        topics: collectionTopicsLookup[collectionId],
                      }
                      return collection
                    })
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