import React, { createContext, useState } from 'react'
import { apiSettings, apiHeaders } from '../Settings'

export const PeopleContext = createContext()

export const PeopleProvider = props => {
    const [friends, setFriends] = useState([])
    const [foundPeople, setFoundPeople] = useState([])

    const getFriends = () => {
        return fetch(`${apiSettings.baseUrl}/friends`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setFriends)
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
            friends,
            getFriends,
            inviteUser,
            rejectUser,
            acceptUser,
            searchPeople,
            foundPeople,
            resetSearch
        }}>
            {props.children}
        </PeopleContext.Provider>
    )
}