// Pull the current user from the local API

import { authApi, userStorageKey } from './authSettings'

export let currentUser = {}

export const getCurrentUser = () => {
        const id = parseInt(sessionStorage.getItem(userStorageKey))
        return fetch(`${authApi.localApiBaseUrl}/users/${id}`)
            .then(res => res.json())
            .then(pRes => currentUser = pRes)
    }
