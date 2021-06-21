// This Module is the primary view of all friends logic.
// This module displays 3 sections:
// - Pending friends, in which the current user is awaiting the other party's acceptance
// - Awaiting friends, in which the current user needs to response to a friend request
// - Confirmed friends, in which the current user and the other party have confirmed the pairing.

import { makeStyles } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { userIdStorageKey } from '../auth/authSettings'
import { PeopleContext } from './PeopleProvider'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Fab from '@material-ui/core/Fab'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
            margin: theme.spacing(1),
            height: "fit-content",
        },
        marginBottom: "7vh",
        marginTop: "2vh",
        borderRadius: "5px",
    },
    friendsList: {
        padding: 0,
    },
    friendPaper: {
        borderRadius: "5px"
    },
    fabs: {
        margin: theme.spacing(1),
        alignSelf: 'flex-end',
    },
    topItem: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    bottomItem: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    pending: {
        background: theme.palette.info.light
    },
    awaiting: {
        background: theme.palette.info.main
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
}))

export const PeopleList = props => {
    const classes = useStyles(props.theme)
    const { friendPairs, getFriendPairs, rejectUser, acceptUser } = useContext(PeopleContext)
    const [pendingFriends, setPendingFriends] = useState([])
    const [awaitingFriends, setAwaitingFriends] = useState([])
    const [confirmedFriends, setConfirmedFriends] = useState([])
    const [rejectedFriendPair, setRejectedFriendPair] = useState(0)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const userId = parseInt(sessionStorage.getItem(userIdStorageKey))

    useEffect(() => {
        getFriendPairs()
    }, [])

    useEffect(() => {
        // Filter friend pairs in which the user has invited someone and is waiting
        setPendingFriends(friendPairs.filter(pair => {
            return pair.accepted == false && pair.user_1.id == userId
        }))
        // Filter friend pairs in which the user needs to respond to an invitation
        setAwaitingFriends(friendPairs.filter(pair => {
            return pair.accepted == false && pair.user_2.id == userId
        }))
        // Filter friend pairs in which the pair is confirmed friends
        setConfirmedFriends(friendPairs.filter(pair => {
            return pair.accepted == true
        }))
    }, [friendPairs])

    const confirmDelete = e => {
        // Grab the friend pair ID, then stage it for deletion in rejectedFriendPair
        const inviteId = e.currentTarget.id.split("--")[1]
        setRejectedFriendPair(parseInt(inviteId))
        setDeleteModalOpen(true)
    }
    const handleAccept = e => {
        // Grab the friend pair ID, then send an "accepted" request
        const inviteId = e.currentTarget.id.split("--")[1]
        acceptUser(inviteId)
            .then(() => {
                getFriendPairs()
            })
    }

    const handleReject = e => {
        // Confirmed rejection - send a delete request for the friend pair
        rejectUser(rejectedFriendPair)
            .then(() => {
                // Reset the staged friend pair for deletion to 0 for safety
                setRejectedFriendPair(0)
                setDeleteModalOpen(false)
                getFriendPairs()
            })
    }

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false)
    }

    return (
        <div className={classes.root}>
            {/* Ensure the section only appears if awaitingFriends contains someone */}
            {!!awaitingFriends.length && <div>
                <Typography align={"center"} variant={"h5"}>Your invites</Typography>
                <Paper className={classes.friendPaper} elevation={3}>
                    <List className={classes.friendsList}>
                        {
                            awaitingFriends.map((f, i) => {
                                let thisClass = `${classes.awaiting}`
                                // add a border radius to top and bottom list items
                                if (i == 0) thisClass += ` ${classes.topItem}`
                                if (i == awaitingFriends.length - 1) thisClass += ` ${classes.bottomItem}`
                                return (
                                    <ListItem className={thisClass} key={f.id}>
                                        <ListItemText primary={f.user_1.first_name + ' ' + f.user_1.last_name + ' invited you'} />
                                        {/* Delete Button  */}
                                        <ListItemIcon onClick={confirmDelete} id={"request--" + f.id}>
                                            <Fab className={`${classes.fabs} ${classes.reject}`} id={f.id} aria-label="reject">
                                                <ClearIcon />
                                            </Fab>
                                        </ListItemIcon>
                                        {/* Confirm button */}
                                        <ListItemIcon onClick={handleAccept} id={"request--" + f.id}>
                                            <Fab className={`${classes.fabs} ${classes.accept}`} id={f.id} aria-label="accept">
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
            {/* Ensure the section only appears if pendingFriends contains someone */}
            {!!pendingFriends.length && <div>
                <Typography align={"center"} variant={"h5"}>Folks you invited</Typography>
                <Paper className={classes.friendPaper} elevation={3}>
                    <List className={classes.friendsList}>
                        {
                            pendingFriends.map((f, i) => {
                                let thisClass = `${classes.pending}`
                                // add a border radius to top and bottom list items
                                if (i == 0) thisClass += ` ${classes.topItem}`
                                if (i == pendingFriends.length - 1) thisClass += ` ${classes.bottomItem}`
                                return (
                                    <ListItem className={thisClass} key={f.id}>
                                        <ListItemText primary={'You invited ' + f.user_2.first_name + ' ' + f.user_2.last_name} />
                                        {/* Delete button  */}
                                        <ListItemIcon onClick={confirmDelete} id={"request--" + f.id}>
                                            <Fab className={`${classes.fabs} ${classes.reject}`} id={f.id} aria-label="reject">
                                                <ClearIcon />
                                            </Fab>
                                        </ListItemIcon>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Paper>
            </div>}
            {/* Ensure the section only appears if confirmedFriends contains someone */}
            {!!confirmedFriends.length && <div>
                <Typography align={"center"} variant={"h5"}>My Friends</Typography>
                <Paper className={classes.friendPaper} elevation={3}>
                    <List className={classes.friendsList}>
                        {
                            confirmedFriends.map((f, i) => {
                                let thisClass = `${classes.confirmed}`
                                // add a border radius to top and bottom list items
                                if (i == 0) thisClass += ` ${classes.topItem}`
                                if (i == confirmedFriends.length - 1) thisClass += ` ${classes.bottomItem}`
                                // Assign friend to the non-current user of the user_pair
                                let friend = f.user_1
                                if (f.user_1.id === userId) friend = f.user_2
                                return (
                                    <ListItem className={thisClass} key={friend.id}>
                                        <ListItemText primary={friend.first_name + ' ' + friend.last_name} />
                                        {/* DeleteButton */}
                                        <ListItemIcon onClick={confirmDelete} id={"request--" + f.id}>
                                            <Fab className={`${classes.fabs} ${classes.reject}`} id={f.id} aria-label="reject">
                                                <ClearIcon />
                                            </Fab>
                                        </ListItemIcon>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Paper>
            </div>}
            {/* Delete job confirmation modal */}
            <Modal
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
                aria-labelledby="delete-confirm-modal"
                aria-describedby="delete-confirm-modal"
            >
                <Paper className={classes.rejectConfirmModal}>Are you sure?
                    <Button onClick={handleReject} className={classes.rejectConfirmButton}>
                        Reject
                    </Button>
                </Paper>
            </Modal>
        </div>
    )
}