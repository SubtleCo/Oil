// This module is responsible for holding all API call functions inside 
//  "JobsContext".

import React, { createContext, useState } from 'react'
// grab the base API url as well as authenticated headers per each user
import { apiSettings, apiHeaders } from '../Settings'

export const JobsContext = createContext()

export const JobsProvider = props => {
    const [userJobs, setUserJobs] = useState([])
    const [jobTypes, setJobTypes] = useState([])
    const [userJobInvites, setUserJobInvites] = useState([])

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

    const inviteToJob = (jobId, userId) => {
        return fetch(`${apiSettings.baseUrl}/jobs/${jobId}/share`, {
            method: "POST",
            headers: apiHeaders(),
            body: JSON.stringify({
                invitee: userId
            })
        })
    }

    const getUserJobInvites = () => {
        return fetch(`${apiSettings.baseUrl}/shared`, {
            headers: apiHeaders()
        })
            .then(res => res.json())
            .then(setUserJobInvites)
    }

    const acceptJob = jobInviteId => {
        return fetch(`${apiSettings.baseUrl}/shared/${jobInviteId}`, {
            method: "PUT",
            headers: apiHeaders()
        })
    }

    const rejectJob = jobInviteId => {
        return fetch(`${apiSettings.baseUrl}/shared/${jobInviteId}`, {
            method: "DELETE",
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
        completeJob,
        inviteToJob,
        acceptJob,
        rejectJob,
        getUserJobInvites,
        userJobInvites
    }}>
        {props.children}
    </JobsContext.Provider>
}