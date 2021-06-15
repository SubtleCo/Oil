// This module is responsible for listing the detail of a job, the share functionality, and delete
import Paper from '@material-ui/core/Paper'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { JobsContext } from './JobsProvider'
import { makeStyles, Typography } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles(theme => ({
    outerPaper: {
        width: "90%",
        margin: "auto",
        padding: "0.5em",
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
}))

export const JobDetail = props => {
    const classes = useStyles(props.theme);
    const { jobId } = useParams()
    const { getJobById } = useContext(JobsContext)
    const [job, setJob] = useState({})
    const history = useHistory()

    useEffect(() => {
        getJobById(parseInt(jobId))
            .then(setJob)
    }, [])

    return (
        <>
            <Typography component="h2" variant="h2" align='center'>Job Detail</Typography>
            <Paper className={classes.outerPaper} elevation={6}>
                <Typography component="h4" variant="h4" align='center'>{job.title}</Typography>
                <Typography className={classes.description} component="p" variant="p" align='left'>{job.description}</Typography>
                <Typography className={classes.details} component="p" variant="p" align='left'>Every {job.frequency} days</Typography>
                <Typography className={classes.details} component="p" variant="p" align='left'>
                    Last completed {new Date(job.last_completed).toLocaleDateString('en-es')} by {job.last_completed_by?.first_name}
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
                <Fab onClick={() => history.push(`/jobs/create`)} className={`${classes.jobDetailButton} ${classes.deleteButton}`}>
                    <DeleteIcon />
                </Fab>
            </section>
        </>
    )
}

// List the detail

// Provide a "Delete" button

// Provide a "Share" button