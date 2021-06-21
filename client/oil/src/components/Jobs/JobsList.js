// This module is responsible for the "/jobs" view
// A user is greeted with a list of every job they are a part of,
//  whether they created or were invited to the job

import React, { useContext, useEffect, useState } from 'react'
import { JobsContext } from './JobsProvider'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddIcon from '@material-ui/icons/Add'
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router'
import Fab from '@material-ui/core/Fab'
import { userIdStorageKey } from '../auth/authSettings'
import ClearIcon from '@material-ui/icons/Clear'
import DoneIcon from '@material-ui/icons/Done'

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
    },
    invited: {
        background: theme.palette.info.light
    },
    jobInviteBanner: {
        textAlign: "center"
    },
    accept: {
        background: theme.palette.success.light
    },
    reject: {
        background: theme.palette.error.light
    },
}))

export const JobsList = props => {
    const history = useHistory()
    const { userJobs,
        getAllUserJobs,
        acceptJob,
        rejectJob,
        userJobInvites,
        getUserJobInvites
    } = useContext(JobsContext)
    const [invitedTo, setInvitedTo] = useState([])
    const classes = useStyles()
    const userId = parseInt(sessionStorage.getItem(userIdStorageKey))

    useEffect(() => {
        getAllUserJobs()
        getUserJobInvites()
    }, [])

    useEffect(() => {
        if (!!userJobInvites.length) {
            const jobInvites = userJobInvites.filter(ji => ji.invitee.id == userId)
            setInvitedTo(jobInvites)
        }
    }, [userJobInvites])

    const confirmReject = () => {

    }

    const handleAccept = () => {

    }

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
                {/* ensure the Paper element only appears if the user has a job invite to list */}
                {!!invitedTo.length && <div className={classes.jobInvites}>
                    <Typography align={"center"} variant={"h5"}>Your invites</Typography>
                    <Paper elevation={3}>
                        <List>
                            {
                                invitedTo.map(jobInvite => {
                                    return (
                                        <ListItem key={jobInvite.id} className={classes.invited}>
                                            <ListItemText primary={jobInvite.job.title} />
                                            <ListItemIcon onClick={confirmReject} id={"request--" + jobInvite.id}>
                                                <Fab className={`${classes.fabs} ${classes.reject}`} id={jobInvite.id} aria-label="reject">
                                                    <ClearIcon />
                                                </Fab>
                                            </ListItemIcon>
                                            {/* Confirm button */}
                                            <ListItemIcon onClick={handleAccept} id={"request--" + jobInvite.id}>
                                                <Fab className={`${classes.fabs} ${classes.accept}`} id={jobInvite.id} aria-label="accept">
                                                    <DoneIcon />
                                                </Fab>
                                            </ListItemIcon>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </Paper>
                </div>}
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