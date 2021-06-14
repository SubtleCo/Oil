// Footer module - persistant and fixed on all page views if user is logged in

import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import WorkIcon from '@material-ui/icons/Work'
import PeopleIcon from '@material-ui/icons/People'
import FaceIcon from '@material-ui/icons/Face'
import { Link } from '@material-ui/core'




export const Footer = ({ theme }) => {
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
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        // <BottomNavigation
        //     value={value}
        //     onChange={(event) => {
        //         setValue(event.target.newValue);
        //     }}
        //     showLabels
        //     className={classes.root}
        //     >
        //     <BottomNavigationAction className={classes.bottomLink} value={0} label="Today" icon={<WbSunnyIcon />} component={Link} href="/" />
        //     <BottomNavigationAction className={classes.bottomLink} value={1} label="Jobs" icon={<WorkIcon />} component={Link} href="/" />
        //     <BottomNavigationAction className={classes.bottomLink} value={2} label="People" icon={<PeopleIcon />} component={Link} href="/" />
        //     <BottomNavigationAction className={classes.bottomLink} value={3} label="Profile" icon={<FaceIcon />} component={Link} href="/" />
        // </BottomNavigation>
        <BottomNavigation value={value} onChange={handleChange} className={classes.stickToBottom} showLabels>
            <BottomNavigationAction classes={classes} label="Today" value="today" icon={<WbSunnyIcon />} />
            <BottomNavigationAction classes={classes} label="Jobs" value="jobs" icon={<WorkIcon />} />
            <BottomNavigationAction classes={classes} label="People" value="people" icon={<PeopleIcon />} />
            <BottomNavigationAction classes={classes} label="Profile" value="profile" icon={<FaceIcon />} />
        </BottomNavigation>
    )
}