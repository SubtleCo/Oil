import React, { createContext, useState } from 'react'
import { apiSettings, apiHeaders } from '../Settings'

export const JobsContext = createContext()

export const JobsProvider = props => {
    const [userJobs, setUserJobs] = useState([])

    const getAllUserJobs = () => {
        return fetch(`${apiSettings.baseUrl}/jobs`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setUserJobs)
    }

    return <JobsContext.Provider value={{
        userJobs,
        getAllUserJobs
    }}>
        {props.children}
    </JobsContext.Provider>
}