// This module is responsible for API call functions regarding people and friend invitations
// nB. There is no "get all people" function, as users should not be browsable.

import React, { createContext, useState } from 'react'
import { apiSettings, apiHeaders } from '../Settings'

export const PeopleContext = createContext()

export const PeopleProvider = props => {
    const [friendPairs, setFriendPairs] = useState([])
    const [foundPeople, setFoundPeople] = useState([])
    const [confirmedFriends, setConfirmedFriends] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    const getCurrentUser = () => {
        return fetch(`${apiSettings.baseUrl}/users/me`,{
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setCurrentUser)
    }

    // FriendPairs contain two full users, one of which will be the current user
    const getFriendPairs = () => {
        return fetch(`${apiSettings.baseUrl}/friends`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setFriendPairs)
    }

    // Get confirmed friends
    const getConfirmedFriends = () => {
        return fetch(`${apiSettings.baseUrl}/friends/confirmed`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setConfirmedFriends)
    }

    const inviteUser = id => {
        return fetch(`${apiSettings.baseUrl}/friends/${id}/invite`, {
            method: "GET",
            headers: apiHeaders()
        })
    }

    // id here is the user_pair object id, not a user id
    const rejectUser = id => {
        return fetch(`${apiSettings.baseUrl}/friends/${id}`, {
            method: "DELETE",
            headers: apiHeaders()
        })
    }

    // id here is the user_pair object id, not a user id /friends/pk/accept
    const acceptUser = id => {
        return fetch(`${apiSettings.baseUrl}/friends/${id}/accept`, {
            headers: apiHeaders()
        })
    }

    // Search key will run a "contains" query on email and username, case insensitive 
    const searchPeople = key => {
        return fetch(`${apiSettings.baseUrl}/users?search=${key}`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setFoundPeople)
    }

    const resetSearch = () => {
        setFoundPeople([])
    }

    return (
        <PeopleContext.Provider value={{
            friendPairs,
            getFriendPairs,
            inviteUser,
            rejectUser,
            acceptUser,
            searchPeople,
            foundPeople,
            resetSearch,
            confirmedFriends,
            getConfirmedFriends,
            getCurrentUser,
            currentUser
        }}>
            {props.children}
        </PeopleContext.Provider>
    )
}