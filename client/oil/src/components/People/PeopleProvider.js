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
            .then(res => res.json())
            .then(setFriends)
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
            searchPeople,
            foundPeople,
            resetSearch
        }}>
            {props.children}
        </PeopleContext.Provider>
    )
}