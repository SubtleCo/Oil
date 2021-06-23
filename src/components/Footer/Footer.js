// Footer module - persistant and fixed on all page views if user is logged in
// This will be the core method of navigation for the app, consisting of:
// - The "Today" view
// - The "Jobs" view
// - The "Folks" view
// - The user's profile options, which are "Profile" to edit the profile and "Logout"

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { makeStyles } from '@material-ui/core/styles'
import React, { useContext, useEffect, useState } from 'react'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import WorkIcon from '@material-ui/icons/Work'
import PeopleIcon from '@material-ui/icons/People'
import FaceIcon from '@material-ui/icons/Face'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useHistory } from 'react-router'
import { userIdStorageKey, userTokenStorageKey } from '../auth/authSettings'
import { PeopleContext } from '../People/PeopleProvider'

export const Footer = ({ theme }) => {
    const history = useHistory()
    const { getCurrentUser, currentUser } = useContext(PeopleContext)

    // Footer Styling
    const useStyles = makeStyles(theme => (
        {
            root: {
                color: theme.palette.primary.main[100],
                "&$selected": {
                    color: "black"
                },
                background: theme.palette.secondary.main
            },
            selected: {
                color: "black"
            },
            stickToBottom: {
                width: '100%',
                position: 'fixed',
                bottom: 0,
            }
        }
    ))
    const classes = useStyles()

    // Handle focus of last tapped menu item
    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Profile pop up menu logic
    const [anchorEl, setAnchorEl] = useState(null)
    const handleProfileMenu = e => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        getCurrentUser()
    }, [])

    return (
        <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom} showLabels>
            <BottomNavigationAction classes={classes} label="Today" value="today" onClick={() => history.push("/")} icon={<WbSunnyIcon />} />
            <BottomNavigationAction classes={classes} label="Jobs" value="jobs" onClick={() => history.push("/jobs")} icon={<WorkIcon />} />
            <BottomNavigationAction classes={classes} label="Folks" value="folks" onClick={() => history.push("/people")} icon={<PeopleIcon />} />
            <BottomNavigationAction aria-controls="simple-menu" aria-haspopup="true" onClick={handleProfileMenu} classes={classes} label={currentUser.first_name} value="profile" icon={<FaceIcon />} />
            {/* Pop up menu for the profile navigation item */}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose()
                    history.push("/profile")
                }
                } value="profile">Profile</MenuItem>
                <MenuItem onClick={() => {
                    handleClose()
                    sessionStorage.clear(userIdStorageKey, userTokenStorageKey)
                    history.push("/")
                }
                }>Logout</MenuItem>
            </Menu>
        </BottomNavigation>
    )
}