import React from 'react'
import { Redirect, Route } from 'react-router'
import { ApplicationViews } from './ApplicationViews'
import { userTokenStorageKey } from './auth/authSettings'
import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { Footer } from './Footer/Footer'
import { Header } from './Header/Header'
import { PeopleProvider } from './People/PeopleProvider'

export const Oil = ({ theme }) => {
    return (
        <>
            <PeopleProvider>
                <Route render={() => {
                    if (sessionStorage.getItem(userTokenStorageKey)) {
                        return (
                            <>
                                <Header />
                                <ApplicationViews />
                                <Footer theme={theme} />
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
            </PeopleProvider>
        </>
    )
}