import React from 'react'
import { Redirect, Route } from 'react-router'
import { useLocation } from 'react-router-dom'
import { ApplicationViews } from './ApplicationViews'
import { userTokenStorageKey } from './auth/authSettings'
import { Login } from './auth/Login'
import { Register } from './auth/Register'

export const Oil = ({ theme }) => {
    const location = useLocation()
    location.pathname.includes("profile")
    return (
        <>
            <Route render={() => {
                if (sessionStorage.getItem(userTokenStorageKey) &&
                    !location.pathname.includes("profile")) {
                    return (
                        <>
                            <ApplicationViews />
                        </>
                    )
                } else if (sessionStorage.getItem(userTokenStorageKey) && location.pathname.includes("profile")) {
                    return <Register />
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