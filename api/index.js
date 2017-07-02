import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.kit.com/'
});

function fetch (endpoint) {
	return instance.get(endpoint)
}

export default {
	collection (ownerUsername, collectionUrlKey) {
		return fetch(`collections?ownerUsername=${ownerUsername}&collectionUrlKey=${collectionUrlKey}`)
	},
	collectionLikes (collectionIds) {
		return fetch(`collection_like_counts?collectionId=${collectionIds.join()}`)
	},
	collectionTopics (collectionId) {
		return fetch(`collections/${collectionId}/topics`)
	},
	recommendations (collectionId) {
		return fetch(`recommendations?collectionId=${collectionId}&versionRequest=false`)
	},
	search (query) {
	  return fetch(`search/collections?query=${query}`)
	},
	topics (topicId) {
		let endpoint
		switch (topicId) {
			case 'for-you':
				endpoint = `featured_collections`
				break
			case 'trending':
				endpoint = `trending_collections`
				break
			case 'new':
				endpoint = `new_collections`
				break
			case 'staff':
				endpoint = `topics/95/trending_collections`
				break
			default:
				endpoint = `topics/${topicId}/trending_collections`
		}
		return fetch(endpoint)
	},
}
