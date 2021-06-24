// Login module

import React, { useState } from "react"
import { useHistory } from "react-router-dom";
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
    badLoginModal: {
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
    registerButton: {
        width: "40%",
        background: theme.palette.secondary.main
    },
    submitButton: {
        width: "40%",
        background: theme.palette.success.light
    },
}))

export const Login = props => {
    const [loginUser, setLoginUser] = useState({ username: "", password: "" })
    const [BadLoginModal, setBadLoginModal] = useState(false)
    const classes = useStyles(props.theme)
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
                    setBadLoginModal(true)
                }
            })
    }

    return (
        <>
            <Header date={false} />
            <div className={classes.secretPadding} />
                <form className={classes.root} onSubmit={handleLogin}>
                    <Typography align="center" variant="h4">Please sign in</Typography>
                    <TextField className={classes.inputField}
                        type="username"
                        id="username"
                        placeholder="username"
                        name="username"
                        label="Username"
                        aria-label="Username"
                        variant="outlined"
                        required autoFocus
                        value={loginUser.username}
                        onChange={handleInputChange} />
                    <TextField className={classes.inputField}
                        type="password"
                        id="password"
                        placeholder="password"
                        name="password"
                        label="Password"
                        aria-label="Password"
                        variant="outlined"
                        required autoFocus
                        value={loginUser.password}
                        onChange={handleInputChange} />
                    <div className={classes.buttonContainer}>
                        <Button
                            className={classes.registerButton}
                            onClick={() => history.push("/register")}
                            variant="outlined">
                            Register
                        </Button>
                        <Button
                            className={classes.submitButton}
                            type="submit"
                            variant="outlined">
                            Sign in
                        </Button>
                    </div>
                </form>
            {/* Failed login dialog box */}
            <Modal open={BadLoginModal}
                onClose={() => setBadLoginModal(false)}>
                <Paper className={classes.badLoginModal}>
                    We can't find a username and password that match. Are you sure you're registered?

                </Paper>
            </Modal>
        </>
    )
}

