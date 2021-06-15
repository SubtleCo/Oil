// This module is responsible for listing the detail of a job, the share functionality, and delete
import Paper from '@material-ui/core/Paper'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { JobsContext } from './JobsProvider'
import { makeStyles, Typography } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share';
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
    outerPaper: {
        width: "90%",
        margin: "auto",
        marginTop: "20%",
        padding: "0.5em",
        display: "flex",
        flexDirection: "column"
    },
    submitButton: {
        alignSelf: "flex-end",
        width: "25%",
        background: theme.palette.success.main
    },
    description: {
        marginTop: "10px",
        marginBottom: "10px",
        fontStyle: "italic"
    },
    details: {
        marginTop: "10px",
        marginBottom: "10px",
    },
    detailRight: {
        alignSelf: "center"
    },
    jobDetailButtons: {
        display: "flex",
        justifyContent: "flex-end",
        margin: "20px"
    },
    jobDetailButton: {
        marginLeft: "20px"
    },
    shareButton: {
        background: theme.palette.info.light
    },
    editButton: {
        background: theme.palette.secondary.main
    },
    deleteButton: {
        background: theme.palette.error.light
    },
    deleteModal: {
        display: "flex",
        position: 'absolute',
        top: "40vh",
        left: "20vw",
        width: "40vw",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}))

export const JobDetail = props => {
    const classes = useStyles(props.theme);
    const { jobId } = useParams()
    const { getJobById, deleteJob } = useContext(JobsContext)
    const [job, setJob] = useState({})
    const history = useHistory()
    const [modalOpen, setModalOpen] = useState(false)
    const [lastCompletedDate, setLastCompletedDate] = useState("")

    useEffect(() => {
        getJobById(parseInt(jobId))
            .then(job => {
                setJob(job)
                let dbDate = new Date(job.last_completed)
                // correct the date, which will be off by one thanks to JS Date
                dbDate.setDate(dbDate.getDate() + 1)
                const niceDate = dbDate.toLocaleDateString('en-es')
                setLastCompletedDate(niceDate)
            })
    }, [])

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleDelete = () => {
        deleteJob(jobId)
        history.push("/jobs")
    }

    return (
        <>
            <Typography component="h2" variant="h2" align='center'>Job Detail</Typography>
            <Paper className={classes.outerPaper} elevation={6}>
                <Typography component="h4" variant="h4" align='center'>{job.title}</Typography>
                <Typography className={`${classes.details} ${classes.detailRight}`} component="p" variant="p" align='left'>({job.type?.title})</Typography>
                <Typography className={classes.description} component="p" variant="p" align='left'>{job.description}</Typography>
                <Typography className={classes.details} component="p" variant="p" align='left'>Repeats every {job.frequency} days</Typography>
                <Typography className={classes.details} component="p" variant="p" align='left'>
                    Last completed on {lastCompletedDate} by {job.last_completed_by?.first_name}
                </Typography>

                {/* Only list out the shared user section if more than one user is on jobs.users */}
                {job.users?.length > 1 && <div className="sharedUsers">
                    <Typography className={classes.details} component="p" variant="p" align='left'>Shared with:</Typography>
                    <List>
                        {
                            job.users?.map(user => <ListItem key={user.id}>{user.first_name} {user.last_name}</ListItem>)
                        }
                    </List>
                </div>}
                {job.users?.length < 2 && <div className="sharedUsers">
                    <Typography className={classes.details} component="p" variant="p" align='left'>This job isn't shared with anyone</Typography>
                </div>}

            </Paper>
            <section className={classes.jobDetailButtons}>
                <Fab onClick={() => history.push(`/jobs/create`)} className={`${classes.jobDetailButton} ${classes.shareButton}`}>
                    <ShareIcon />
                </Fab>
                <Fab onClick={() => history.push(`/jobs/${job.id}/edit`)} className={`${classes.jobDetailButton} ${classes.editButton}`}>
                    <EditIcon />
                </Fab>
                <Fab onClick={handleModalOpen} className={`${classes.jobDetailButton} ${classes.deleteButton}`}>
                    <DeleteIcon />
                </Fab>
            </section>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="delete-confirm-modal"
                aria-describedby="delete-confirm-modal"
            >
                <Paper className={classes.deleteModal}>Are you sure?
                    <Button onClick={handleDelete} className={`${classes.jobDetailButton} ${classes.deleteButton}`}>
                        Delete
                    </Button>
                </Paper>
            </Modal>
        </>
    )
}

// List the detail

// Provide a "Delete" button

// Provide a "Share" button