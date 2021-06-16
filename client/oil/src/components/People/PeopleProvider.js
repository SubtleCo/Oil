import React, { createContext, useState } from 'react'
import { apiSettings, apiHeaders } from '../Settings'

export const PeopleContext = createContext()

export const PeopleProvider = props => {
    const [foundPeople, setFoundPeople] = useState([])

    const searchPeople = key => {
        return fetch(`${apiSettings.baseUrl}/users?search=${key}`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setFoundPeople)
    }

    return (
        <PeopleContext.Provider value={{
            searchPeople,
            foundPeople
        }}>
            {props.children}
        </PeopleContext.Provider>
    )
}