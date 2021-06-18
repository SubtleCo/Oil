// Registration module

import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { authApi, userIdStorageKey, userTokenStorageKey } from "./authSettings"
import "./Login.css"

export const Register = () => {

    const [registerUser, setRegisterUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: ""
    })
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [conflictDialog, setConflictDialog] = useState(false)
    const loggedInUserId = parseInt(sessionStorage.getItem(userIdStorageKey))
    let text = {}

    const history = useHistory()

    useEffect(() => {
        // Check to see if a user is logged in (editing account) or not (adding account)
        if (loggedInUserId) {
            return fetch(`${authApi.localApiBaseUrl}/users/${loggedInUserId}`)
                .then(res => res.json())
                .then(setRegisterUser)
        }
    }, [loggedInUserId])

    // Keep track of user input
    const handleInputChange = (event) => {
        const newUser = { ...registerUser }
        if (event.target.id.includes("Id")) {
            newUser[event.target.id] = parseInt(event.target.value)
        } else {
            newUser[event.target.id] = event.target.value
        }
        setRegisterUser(newUser)
    }

    const existingUserCheck = () => {

        return fetch(`${authApi.localApiBaseUrl}/email?email=${registerUser.email}`)
            .then(res => res.json())
            .then(jsonRes => jsonRes.valid)
    }

    const editUser = () => {
        return fetch(`${authApi.localApiBaseUrl}/users/${loggedInUserId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: registerUser.email,
                first_name: registerUser.firstName,
                last_name: registerUser.lastName,
                password: registerUser.password,
                username: registerUser.username
            })
        })
            .then(history.push("/"))
    }

    const handleRegister = (e) => {
        e.preventDefault()
        // If the user is logged in, check to see the passwords match, then edit the user
        if (loggedInUserId) {
            if (registerUser.password === passwordConfirm) {
                return editUser()
            } else {
                return window.alert('Passwords do not match')
            }
        }
        existingUserCheck()
            // if the new user has a unique email to the API, register a new user
            .then((emailAvailable) => {
                if (emailAvailable) {
                    if (registerUser.password === passwordConfirm) {
                        fetch(`${authApi.localApiBaseUrl}/register`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email: registerUser.email,
                                first_name: registerUser.firstName,
                                last_name: registerUser.lastName,
                                password: registerUser.password,
                                username: registerUser.username
                            })
                        })
                            .then(res => res.json())
                            .then(createdUser => {
                                if (createdUser.hasOwnProperty("id")) {
                                    sessionStorage.setItem(userIdStorageKey, createdUser.id)
                                    sessionStorage.setItem(userTokenStorageKey, createdUser.token)
                                    history.push("/")
                                }
                            })
                    } else {
                        window.alert('Passwords do not match')
                    }
                }
                else {
                    setConflictDialog(true)
                }
            })
    }


    // Set display text based on if this is a create or an edit session
    if (loggedInUserId) {
        text.greeting = "Changed your mind about something?"
        text.detail = "No problem! You can change your name, email, password, or track value!"
        text.button = "Edit Account"
    } else {
        text.greeting = "Howdy, stranger!"
        text.detail = "Tell us about yourself"
        text.button = "Create Account"
    }
    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" open={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => setConflictDialog(false)}>Close</button>
            </dialog>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">{text.greeting}</h1>
                <h4 className="h4 mb-3 font-weight-normal">{text.detail}</h4>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input type="text" name="firstName" id="firstName" className="form-control" placeholder="First name" required autoFocus value={registerUser.firstName} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input type="text" name="lastName" id="lastName" className="form-control" placeholder="Last name" required value={registerUser.lastName} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="username"> Username </label>
                    <input type="text" name="username" id="username" className="form-control" placeholder="Username" required value={registerUser.username} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputEmail"> Email address </label>
                    <input type="email" name="email" id="email" className="form-control" placeholder="Email address" required value={registerUser.email} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="password"> Password </label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="password" required value={registerUser.password} onChange={handleInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="confirm"> Confirm Password </label>
                    <input type="password" name="confirm" id="confirm" className="form-control" placeholder="confirm password" required onChange={e => setPasswordConfirm(e.target.value)} />
                </fieldset>
                <fieldset>
                    <button type="submit"> {text.button} </button>
                </fieldset>
            </form>
        </main>
    )
}

