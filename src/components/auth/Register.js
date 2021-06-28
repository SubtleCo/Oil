// Registration module

import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { apiHeaders } from "../Settings"
import { authApi, userIdStorageKey, userTokenStorageKey } from "./authSettings"
import "./Login.css"
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { Header } from '../Header/Header'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.paper,
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        '& > *': {
            margin: theme.spacing(1),
            width: "80%"
        }
    },
    secretPadding: {
        height: "2vh",
        background: theme.palette.secondary.main,
        marginBottom: "2vh"
    },
    emailExistsModal: {
        display: "flex",
        position: 'absolute',
        top: "40vh",
        left: "20vw",
        width: "40vw",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    inputField: {
        background: theme.palette.background.paper,
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between"
    },
    cancel: {
        width: "40%",
        background: theme.palette.secondary.main
    },
    submitButton: {
        width: "40%",
        background: theme.palette.success.light
    },
    slowModal: {
        display: "flex",
        position: 'absolute',
        top: "40vh",
        left: "10vw",
        width: "60vw",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

export const Register = props => {

    const classes = useStyles(props.theme)
    const [registerUser, setRegisterUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: ""
    })
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [emailExistsModal, setEmailExistsModal] = useState(false)
    const [slowModal, setSlowModal] = useState(false)
    const loggedInUserId = parseInt(sessionStorage.getItem(userIdStorageKey))
    let text = {}

    const history = useHistory()

    useEffect(() => {
        // Check to see if a user is logged in (editing account) or not (adding account)
        if (loggedInUserId) {
            return fetch(`${authApi.localApiBaseUrl}/users/me`, {
                headers: apiHeaders()
            })
                .then(res => res.json())
                .then(user => {
                    const thisUser = { ...registerUser }
                    thisUser.firstName = user.first_name
                    thisUser.lastName = user.last_name
                    thisUser.username = user.username
                    thisUser.email = user.email
                    setRegisterUser(thisUser)
                })
        }
        // eslint-disable-next-line
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

    // Make sure a user with that email does not already exist
    const existingUserCheck = () => {
        return fetch(`${authApi.localApiBaseUrl}/email?email=${registerUser.email}`)
            .then(res => res.json())
            .then(jsonRes => jsonRes.valid)
    }

    const editUser = () => {
        return fetch(`${authApi.localApiBaseUrl}/users/${loggedInUserId}`, {
            method: "PUT",
            headers: apiHeaders(),
            body: JSON.stringify({
                email: registerUser.email,
                first_name: registerUser.firstName,
                last_name: registerUser.lastName,
                password: registerUser.password,
                username: registerUser.username
            })
        })
            .then(() => {
                history.push("/")
            })
    }

    const handleRegister = (e) => {
        setSlowModal(true)
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
                    setEmailExistsModal(true)
                    setSlowModal(false)
                }
            })
    }


    // Set display text based on if this is a create or an edit session
    if (loggedInUserId) {
        text.greeting = "Changed your mind?"
        text.detail = "No problem! You can change your name, email, and password."
        text.button = "Edit Account"
    } else {
        text.greeting = "Howdy, stranger!"
        text.detail = "Tell us about yourself"
        text.button = "Create Account"
    }
    return (
        <>
            <Header date={false} />
            <div className={classes.secretPadding} />
            <main style={{ textAlign: "center" }}>
                {/* Failed login dialog box */}
                <Modal open={emailExistsModal}
                    onClose={() => setEmailExistsModal(false)}>
                    <Paper className={classes.emailExistsModal}>
                        Account with that email address already exists
                    </Paper>
                </Modal>
                <Modal open={slowModal}
                    onClose={() => setSlowModal(false)}>
                    <Paper className={classes.slowModal}>
                        <Typography variant="p">
                            On it! Please note - Logging in & registering might be slow - the Oil api is hosted on a free Heroku server, which falls asleep after 30 minutes of inactivity. The first API call (such as logging in) will wake the server, and then the app will run smoothly after.
                        </Typography>
                    </Paper>
                </Modal>

                <form className={classes.root} onSubmit={handleRegister}>
                    <Typography variant="h4">{text.greeting}</Typography>
                    <Typography variant="h6">{text.detail}</Typography>
                    <TextField
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First name"
                        label="First Name"
                        aria-label="First Name"
                        variant="outlined"
                        required
                        autoFocus
                        value={registerUser.firstName}
                        onChange={handleInputChange} />
                    <TextField
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last name"
                        label="Last Name"
                        aria-label="Last Name"
                        variant="outlined"
                        required
                        value={registerUser.lastName}
                        onChange={handleInputChange} />
                    <TextField
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        label="Username"
                        aria-label="Username"
                        variant="outlined"
                        required
                        value={registerUser.username}
                        onChange={handleInputChange} />
                    <TextField
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        label="Email"
                        aria-label="Email"
                        variant="outlined"
                        required
                        value={registerUser.email}
                        onChange={handleInputChange} />
                    <TextField
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        label="Password"
                        aria-label="Password"
                        variant="outlined"
                        required
                        value={registerUser.password}
                        onChange={handleInputChange} />
                    <TextField
                        type="password"
                        name="confirm"
                        id="confirm"
                        placeholder="confirm password"
                        label="Password, but again"
                        aria-label="Password confirmation"
                        variant="outlined"
                        required
                        onChange={e => setPasswordConfirm(e.target.value)} />
                    <div className={classes.buttonContainer}>
                        <Button className={classes.cancel} onClick={() => history.push("/")}> Never Mind </Button>
                        <Button type="submit" className={classes.submitButton}> {text.button} </Button>
                    </div>
                </form>
            </main>
        </>
    )
}

