import React from 'react'
import { Route } from 'react-router-dom'
import { JobsList } from './Jobs/JobsList'
import { JobsProvider } from './Jobs/JobsProvider'

export const ApplicationViews = () => {
    return (
        <>
            <JobsProvider>
                <Route exact path="/">
                    <p>Today View goes here</p>
                </Route>

                <Route exact path="/jobs">
                    <JobsList />
                </Route>

                <Route exact path="/people">
                    <p>People List goes here</p>
                </Route>

                <Route exact path="/profile">
                    <p>Profile Edit goes here</p>
                </Route>
            </JobsProvider>
        </>
    )
}