// This module is responsible for the persistent header in the app
// This includes the app name as well as the current date in mm/dd/yyyy format.

import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import React from 'react'

const useStyles = makeStyles(theme => (
    {
        root: {
            color: theme.palette.primary.main[100],
            "&$selected": {
                color: "black"
            },
            background: theme.palette.secondary.main,
            width: '100%',
            position: 'sticky',
            top: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "2vh",
            fontFamily: "roboto",
            zIndex: 2
        }
    }
))

export const Header = props => {
    const classes = useStyles(props.theme)

    // Pretty date
    const today = new Date()
    const year = today.getFullYear().toString()
    const month = (1 + today.getMonth()).toString()
    const day = today.getDate().toString()
    const niceDate = `${month}/${day}/${year}`

    return (
        <section className={classes.root}>
            <Typography component="h4" variant="h4" align='center'>Oil</Typography>
            <p className={classes.date}>{niceDate}</p>
        </section>
    )
}