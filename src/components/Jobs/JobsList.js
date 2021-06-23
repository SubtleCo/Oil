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
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'


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
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    hiddenDiv: {
        margin: theme.spacing(1),
        width: "56px"
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
    rejectConfirmModal: {
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
    rejectConfirmButton: {
        marginLeft: "20px",
        background: theme.palette.error.light
    },
    topItem: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    bottomItem: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    inviteList: {
        padding: 0,
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
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [rejectedJobInvite, setRejectedJobInvite] = useState(0)

    useEffect(() => {
        getAllUserJobs()
        getUserJobInvites()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!!userJobInvites.length) {
            const jobInvites = userJobInvites.filter(ji => ji.invitee.id === userId)
            setInvitedTo(jobInvites)
        } else {
            setInvitedTo([])
        }
    }, [userJobInvites, userId])

    const confirmReject = e => {
        // Grab the job invite ID, then stage it for deletion in rejectedJobInvite
        const inviteId = e.currentTarget.id.split("--")[1]
        setRejectedJobInvite(parseInt(inviteId))
        setRejectModalOpen(true)
    }

    const handleReject = () => {
        rejectJob(rejectedJobInvite)
            .then(() => {
                setRejectModalOpen(false)
                setRejectedJobInvite(0)
                getUserJobInvites()
            })
    }

    const handleAccept = e => {
        const inviteId = e.currentTarget.id.split("--")[1]
        acceptJob(inviteId)
            .then(() => {
                getAllUserJobs()
                getUserJobInvites()
            })
    }

    const handleRejectModalClose = () => {
        setRejectModalOpen(false)
    }

    return (
        <>
            <div className={classes.root}>
                {/* Header and new job button */}
                <section className={classes.header}>
                    <div className={classes.hiddenDiv}></div>
                    <Typography variant={'h5'} align={'center'} className={classes.headerText}>All My Jobs</Typography>
                    <Fab onClick={() => history.push(`/jobs/create`)} className={classes.fabs}>
                        <AddIcon />
                    </Fab>
                </section>
                {/* ensure the Paper element only appears if the user has a job invite to list */}
                {!!invitedTo.length && <div className={classes.jobInvites}>
                    <Typography align={"center"} variant={"h5"}>Your invites</Typography>
                    <Paper elevation={3}>
                        <List className={classes.inviteList}>
                            {
                                invitedTo.map((jobInvite, i) => {
                                    let thisClass = `${classes.invited}`
                                    // add a border radius to top and bottom list items
                                    if (i === 0) thisClass += ` ${classes.topItem}`
                                    if (i === invitedTo.length - 1) thisClass += ` ${classes.bottomItem}`
                                    return (
                                        <ListItem key={jobInvite.id} className={thisClass}>
                                            <ListItemText primary={`${jobInvite.job.title} (from ${jobInvite.inviter.first_name} ${jobInvite.inviter.last_name})`} />
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
                                        {j.users.length > 1 &&
                                            <ListItemIcon>
                                                <PeopleIcon />
                                            </ListItemIcon>}
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
            {/* Reject job confirmation modal */}
            <Modal
                open={rejectModalOpen}
                onClose={handleRejectModalClose}
                aria-labelledby="delete-confirm-modal"
                aria-describedby="delete-confirm-modal"
            >
                <Paper className={classes.rejectConfirmModal}>Are you sure?
                    <Button onClick={handleReject} className={classes.rejectConfirmButton}>
                        Reject
                    </Button>
                </Paper>
            </Modal>
        </>
    )
}