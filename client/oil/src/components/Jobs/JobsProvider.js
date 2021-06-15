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

    const createJob = newJob => {
        return fetch(`${apiSettings.baseUrl}/jobs`, {
            method: "POST",
            headers: apiHeaders(),
            body: JSON.stringify(newJob)
        })
            .then(res => res.json())
    }

    return <JobsContext.Provider value={{
        userJobs,
        getAllUserJobs,
        createJob
    }}>
        {props.children}
    </JobsContext.Provider>
}