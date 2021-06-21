// Login module

import React, { useContext, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { PeopleContext } from "../People/PeopleProvider";
import { authApi, userIdStorageKey, userTokenStorageKey } from "./authSettings"
import "./Login.css"

export const Login = () => {
    const [loginUser, setLoginUser] = useState({ username: "", password: "" })
    const [BadLoginDialog, setBadLoginDialog] = useState(false)

    const history = useHistory()

    // Keep track of user input
    const handleInputChange = (event) => {
        const newUser = { ...loginUser }
        newUser[event.target.id] = event.target.value
        setLoginUser(newUser)
    }

    const handleLogin = (e) => {
        // Send the username and password as a POST request the API.
        // On successful login, the user's token and ID will be sent back
        // The token and ID will be set in session storage
        e.preventDefault()
        return fetch(`${authApi.localApiBaseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: loginUser.username,
                password: loginUser.password
            })
        })
            .then(res => res.json())
            .then(user => {
                if (user.valid) {
                    sessionStorage.setItem(userIdStorageKey, user.id)
                    sessionStorage.setItem(userTokenStorageKey, user.token)
                    history.push("/")
                } else {
                    setBadLoginDialog(true)
                }
            })
    }

    return (
        <main className="container--login">
            {/* Failed login dialog box */}
            <dialog className="dialog dialog--auth" open={BadLoginDialog}>
                <div>Your username and password don't match. Are you sure you've registered?</div>
                <button className="button--close" onClick={e => setBadLoginDialog(false)}>Close</button>
            </dialog>
            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>Welcome to Oil</h1>
                    <h2>Please sign in</h2>
                    <fieldset>
                        <label htmlFor="inputusername"> Username </label>
                        <input type="username"
                            id="username"
                            className="form-control"
                            placeholder="username"
                            required autoFocus
                            value={loginUser.username}
                            onChange={handleInputChange} />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="inputPassword"> Password </label>
                        <input type="password"
                            id="password"
                            className="form-control"
                            placeholder="password"
                            required autoFocus
                            value={loginUser.password}
                            onChange={handleInputChange} />
                    </fieldset>
                    <fieldset>
                        <button type="submit">
                            Sign in
                        </button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Register for an account</Link>
            </section>
        </main>
    )
}

