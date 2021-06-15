import React, { useContext, useEffect } from 'react'
import { JobsContext } from './JobsProvider'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import WorkIcon from '@material-ui/icons/Work'
import { makeStyles } from '@material-ui/core'
import { useHistory } from 'react-router'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: "100%",
            height: "fit-content",
        },
    }
}))

export const JobsList = props => {
    const history = useHistory()
    const { userJobs, getAllUserJobs } = useContext(JobsContext)
    const classes = useStyles()

    useEffect(() => {
        getAllUserJobs()
    }, [])

    const ListLink = props => {
        return <ListItem button component="a" {...props} />
    }

    return (
        <>
            <h2 className="pageHeader">My Jobs</h2>
            <div className={classes.root}>
                <Paper elevation={3}>
                    <List>
                        {
                            userJobs.map(j => {
                                return (
                                    <ListItem key={j.id}>
                                        <ListItemIcon>
                                            <WorkIcon />
                                        </ListItemIcon>
                                        <ListLink onClick={() => history.push(`/jobs/${j.id}`)}>
                                            <ListItemText primary={j.title} />
                                        </ListLink>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </Paper>
            </div>
        </>
    )
}