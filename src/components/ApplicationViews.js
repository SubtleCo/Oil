
import React from 'react'
import { Route } from 'react-router-dom'
import { JobDetail } from './Jobs/JobDetail'
import { JobForm } from './Jobs/JobForm'
import { JobsList } from './Jobs/JobsList'
import { JobsProvider } from './Jobs/JobsProvider'
import { Today } from './Jobs/Today'
import { PeopleProvider } from './People/PeopleProvider'
import { PeopleSearch } from './People/PeopleSearch'
import { PeopleList } from './People/PeopleList'
import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'

export const ApplicationViews = props => {
    return (
        <>
            <JobsProvider>
                <PeopleProvider>

                    <Header date={true}/>

                    <Route exact path="/">
                        <Today />
                    </Route>

                    <Route exact path="/jobs">
                        <JobsList />
                    </Route>

                    <Route exact path="/jobs/create">
                        <JobForm />
                    </Route>

                    <Route exact path="/jobs/:jobId(\d+)">
                        <JobDetail />
                    </Route>

                    <Route exact path="/jobs/:jobId(\d+)/edit">
                        <JobForm />
                    </Route>

                    <Route exact path="/people">
                        <PeopleSearch />
                        <PeopleList />
                    </Route>

                    <Footer theme={props.theme} />

                </PeopleProvider>
            </JobsProvider>
        </>
    )
}