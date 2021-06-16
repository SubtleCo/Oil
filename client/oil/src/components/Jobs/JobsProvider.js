import React, { createContext, useState } from 'react'
import { apiSettings, apiHeaders } from '../Settings'

export const JobsContext = createContext()

export const JobsProvider = props => {
    const [userJobs, setUserJobs] = useState([])
    const [jobTypes, setJobTypes] = useState([])

    const getAllUserJobs = () => {
        return fetch(`${apiSettings.baseUrl}/jobs`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setUserJobs)
    }

    const getJobById = id => {
        return fetch(`${apiSettings.baseUrl}/jobs/${id}`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
    }

    const createJob = newJob => {
        return fetch(`${apiSettings.baseUrl}/jobs`, {
            method: "POST",
            headers: apiHeaders(),
            body: JSON.stringify(newJob)
        })
            .then(res => res.json())
    }

    const editJob = newJob => {
        return fetch(`${apiSettings.baseUrl}/jobs/${newJob.id}`, {
            method: "PUT",
            headers: apiHeaders(),
            body: JSON.stringify(newJob)
        })
            .then(res => res.json())
    }

    const deleteJob = id => {
        return fetch(`${apiSettings.baseUrl}/jobs/${id}`, {
            method: "DELETE",
            headers: apiHeaders()
        })
    }

    const getJobTypes = () => {
        return fetch(`${apiSettings.baseUrl}/jobtypes`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setJobTypes)
    }

    const completeJob = id => {
        return fetch(`${apiSettings.baseUrl}/jobs/${id}/complete`, {
            headers: apiHeaders()
        })
    }

    return <JobsContext.Provider value={{
        userJobs,
        getAllUserJobs,
        createJob,
        getJobById,
        editJob,
        deleteJob,
        jobTypes,
        getJobTypes,
        completeJob
    }}>
        {props.children}
    </JobsContext.Provider>
}