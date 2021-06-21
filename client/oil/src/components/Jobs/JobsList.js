// This module is responsible for the "/jobs" view
// A user is greeted with a list of every job they are a part of,
//  whether they created or were invited to the job

import React, { useContext, useEffect } from 'react'
import { JobsContext } from './JobsProvider'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddIcon from '@material-ui/icons/Add'
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { makeStyles } from '@material-ui/core'
import { useHistory } from 'react-router'
import Fab from '@material-ui/core/Fab'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            margin: theme.spacing(1),
            height: "fit-content",
        },
        marginBottom: "7vh",
        marginTop: "2vh"
    },
    fabs: {
        margin: theme.spacing(1),
        alignSelf: 'flex-end',
        background: theme.palette.success.light
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}))

export const JobsList = props => {
    const history = useHistory()
    const { userJobs, getAllUserJobs } = useContext(JobsContext)
    const classes = useStyles()

    useEffect(() => {
        getAllUserJobs()
    }, [])

    return (
        <>
            <div className={classes.root}>
                {/* Header and new job button */}
                <section className={classes.header}>
                    <h2 className="pageHeader">All My Jobs</h2>
                    <Fab onClick={() => history.push(`/jobs/create`)} className={classes.fabs}>
                        <AddIcon />
                    </Fab>
                </section>
                {/* ensure the Paper element only appears if the user has a job to list */}
                {!!userJobs.length && <Paper elevation={3}>
                    <List>
                        {
                            userJobs.map(j => {
                                return (
                                    <ListItem key={j.id}>
                                        <ListItemText primary={j.title} />
                                        <ListItemIcon>
                                            <Fab onClick={() => history.push(`/jobs/${j.id}`)} color="secondary" aria-label="edit">
                                                <MenuOpenIcon />
                                            </Fab>
                                        </ListItemIcon>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Paper>}
            </div>
        </>
    )
}