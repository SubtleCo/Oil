// Footer module - persistant and fixed on all page views if user is logged in

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import WorkIcon from '@material-ui/icons/Work'
import PeopleIcon from '@material-ui/icons/People'
import FaceIcon from '@material-ui/icons/Face'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Link } from '@material-ui/core'
import { useHistory } from 'react-router'
import { userIdStorageKey, userTokenStorageKey } from '../auth/authSettings'




export const Footer = ({ theme }) => {
    const history = useHistory()

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


    return (
        <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom} showLabels>
            <BottomNavigationAction classes={classes} label="Today" value="today" onClick={() => history.push("/")} icon={<WbSunnyIcon />} />
            <BottomNavigationAction classes={classes} label="Jobs" value="jobs" onClick={() => history.push("/jobs")} icon={<WorkIcon />} />
            <BottomNavigationAction classes={classes} label="Folks" value="folks" onClick={() => history.push("/people")} icon={<PeopleIcon />} />
            <BottomNavigationAction aria-controls="simple-menu" aria-haspopup="true" onClick={handleProfileMenu} classes={classes} label="Me" value="profile" icon={<FaceIcon />} />
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