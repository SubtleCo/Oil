import React from 'react'
import { Redirect, Route } from 'react-router'
import { userTokenStorageKey } from './auth/authSettings'
import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { Footer } from './Footer/Footer'
import { JobForm } from './Jobs/JobForm'

export const Oil = ({ theme }) => {
    return (
        <>
            <Route render={() => {
                if (sessionStorage.getItem(userTokenStorageKey)) {
                    return (
                        <>
                            <p>You sure are logged in</p>
                            <JobForm />
                            <Footer theme={theme}/>
                        </>
                    )
                } else {
                    return <Redirect to="/login" />;
                }
            }} />

            <Route path="/login">
                <Login />
            </Route>

            <Route path="/register">
                <Register />
            </Route>
        </>
    )
}