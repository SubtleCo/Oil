import React, { useContext, useEffect } from 'react'
import { JobsContext } from './JobsProvider'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddIcon from '@material-ui/icons/Add'
import DoneIcon from '@material-ui/icons/Done';
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
        marginTop: "12vh"
    },
    fabs: {
        margin: theme.spacing(1),
        alignSelf: 'flex-end',
        background: theme.palette.info.light
    },
    pageHeader: {
        alignSelf: "center",
        paddingTop: "2vh"
    },
    lowPriority: {
        background: theme.palette.success.light
    },
    medPriority: {
        background: theme.palette.secondary.light
    },
    highPriority: {
        background: theme.palette.error.light
    },
}))

export const Today = props => {
    const history = useHistory()
    const { userJobs, getAllUserJobs, completeJob } = useContext(JobsContext)
    const classes = useStyles()

    // Pretty day
    const day = new Date().getDay()
    console.log(day)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const niceDay = days[day]

    useEffect(() => {
        getAllUserJobs()
    }, [])

    const handleDone = e => {
        const jobId = e.target.id.split("--")[1]
        console.log(jobId)
        completeJob(jobId)
    }

    return (
        <>
            <div className={classes.root}>
                <h2 className={classes.pageHeader}>Wow, it's already {niceDay}?</h2>
                <Paper elevation={3}>
                    <List>
                        {
                            userJobs.map(j => {
                                if (j.days_lapsed >= 0) {
                                    let priority = classes.lowPriority
                                    if (j.days_lapsed > 2) priority = classes.medPriority
                                    if (j.days_lapsed > 6) priority = classes.highPriority
                                    return (
                                        <ListItem className={priority} key={j.id}>
                                            <ListItemText primary={j.title} />
                                            <ListItemIcon id={"list-item-icon-job--" + j.id}>
                                                <Fab className={classes.fabs} onClick={handleDone} id={"job--" + j.id} aria-label="edit">
                                                    <DoneIcon id={"icon-job--" + j.id}/>
                                                </Fab>
                                            </ListItemIcon>
                                        </ListItem>
                                    )
                                }
                            })
                        }
                    </List>
                </Paper>
            </div>
        </>
    )
}