// This module renders the main view of Oil

// This view will display a list of jobs where the time since "last completed" has overlapped
// "frequency" (days_lapsed >= 0), meaning the job needs to be completed again.

// if days_lapsed is 0 - 2, list item will be green
// if days_lapsed is 3 - 6, list item will be yellow
// if days_lapsed is 7+, list item will be red

import React, { useContext, useEffect, useState } from 'react'
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
        marginTop: "12vh",
        borderRadius: "5px",
    },
    todayList: {
        padding: 0,
    },
    todayPaper: {
        borderRadius: "5px"
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
        background: theme.palette.success.light,
    },
    medPriority: {
        background: theme.palette.secondary.light
    },
    highPriority: {
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
}))

export const Today = props => {
    const history = useHistory()
    const { userJobs, getAllUserJobs, completeJob } = useContext(JobsContext)
    const [dueJobs, setDueJobs] = useState([])
    const classes = useStyles()

    // Pretty day
    const day = new Date().getDay()
    console.log(day)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const niceDay = days[day]

    useEffect(() => {
        getAllUserJobs()
    }, [])

    useEffect(() => {
        setDueJobs(userJobs.filter(j => j.days_lapsed >= 0))
    }, [userJobs])

    const handleDone = e => {
        const jobId = e.currentTarget.id.split("--")[1]
        completeJob(jobId)
            .then(getAllUserJobs)
    }

    return (
        <>
            <div className={classes.root}>
                <h2 className={classes.pageHeader}>Wow, it's already {niceDay}?</h2>
                { !!dueJobs.length && <Paper className={classes.todayPaper} elevation={3}>
                    <List className={classes.todayList}>
                        {
                            dueJobs.map((j,i) => {
                                let priority = classes.lowPriority
                                if (j.days_lapsed > 2) priority = classes.medPriority
                                if (j.days_lapsed > 6) priority = classes.highPriority
                                if (i == 0) priority = `${priority} ${classes.topItem}`
                                if (i == dueJobs.length - 1) priority = `${priority} ${classes.bottomItem}`

                                return (
                                    <ListItem className={priority} key={j.id}>
                                        <ListItemText primary={j.title} />
                                        <ListItemIcon onClick={handleDone} id={"job--" + j.id}>
                                            <Fab className={classes.fabs} aria-label="edit">
                                                <DoneIcon />
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