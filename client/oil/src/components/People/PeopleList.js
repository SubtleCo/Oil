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
    }
}))

export const PeopleList = props => {
    const classes = useStyles(props.theme)
    const { friends, getFriends, rejectUser } = useContext(PeopleContext)
    const [pendingFriends, setPendingFriends] = useState([])
    const [awaitingFriends, setAwaitingFriends] = useState([])
    const [rejectedFriend, setRejectedFriend] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const userId = parseInt(sessionStorage.getItem(userIdStorageKey))

    useEffect(() => {
        getFriends()
    }, [])

    useEffect(() => {
        setPendingFriends(friends?.filter(pair => {
            return pair.accepted == false && pair.user_1.id == userId
        }))
        setAwaitingFriends(friends?.filter(pair => {
            return pair.accepted == false && pair.user_2.id == userId
        }))
    }, [friends])

    const confirmDelete = e => {
        const friendId = e.currentTarget.id.split("--")[1]
        setRejectedFriend(parseInt(friendId))
        setModalOpen(true)
    }
    const handleAccept = e => {
        const friendId = e.currentTarget.id.split("--")[1]
        console.log(`accepted friendRequest ${friendId}`)
    }

    const handleReject = e => {
        rejectUser(rejectedFriend)
            .then(() => {
                setRejectedFriend(0)
                setModalOpen(false)
                getFriends()
            })
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    return (
        <div className={classes.root}>
            <p>Hi there friends</p>
            {!!pendingFriends.length && <Paper className={classes.friendPaper} elevation={3}>
                <List className={classes.friendsList}>
                    {
                        pendingFriends.map((f,i) => {
                            let thisClass = `${classes.pending}`
                            if (i == 0) thisClass += ` ${classes.topItem}`
                            if (i == pendingFriends.length - 1) thisClass += ` ${classes.bottomItem}`
                            return (
                                <ListItem className={thisClass} key={f.id}>
                                    <ListItemText primary={'You invited ' + f.user_2.first_name + ' ' + f.user_2.last_name} />
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
            }
            {!!awaitingFriends.length && <Paper className={classes.friendPaper} elevation={3}>
                <List className={classes.friendsList}>
                    {
                        awaitingFriends.map((f,i) => {
                            let thisClass = `${classes.awaiting}`
                            if (i == 0) thisClass += ` ${classes.topItem}`
                            if (i == awaitingFriends.length - 1) thisClass += ` ${classes.bottomItem}`
                            return (
                                <ListItem className={thisClass} key={f.id}>
                                    <ListItemText primary={f.user_1.first_name + ' ' + f.user_1.last_name + ' invited you'} />
                                    <ListItemIcon onClick={confirmDelete} id={"request--" + f.id}>
                                        <Fab className={`${classes.fabs} ${classes.reject}`} id={f.id} aria-label="reject">
                                            <ClearIcon />
                                        </Fab>
                                    </ListItemIcon>
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
            }
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
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