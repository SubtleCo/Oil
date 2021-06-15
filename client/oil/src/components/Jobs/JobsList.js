import React, { useContext, useEffect } from 'react'
import { JobsContext } from './JobsProvider'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import WorkIcon from '@material-ui/icons/Work'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
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
    },
    fabs: {
        margin: theme.spacing(1),
        alignSelf: 'flex-end'
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

    const ListLink = props => {
        return <ListItem button component="a" {...props} />
    }

    return (
        <>
            <div className={classes.root}>
                <section className={classes.header}>
                    <h2 className="pageHeader">My Jobs</h2>
                    <Fab className={classes.fabs}>
                        <AddIcon />
                    </Fab>
                </section>
                <Paper elevation={3}>
                    <List>
                        {
                            userJobs.map(j => {
                                return (
                                    <ListItem key={j.id}>
                                        <ListLink onClick={() => history.push(`/jobs/${j.id}`)}>
                                            <ListItemText primary={j.title} />
                                        </ListLink>
                                        <ListItemIcon>
                                            <Fab color="secondary" aria-label="edit">
                                                <EditIcon onClick={() => history.push(`/jobs/${j.id}/edit`)} />
                                            </Fab>
                                        </ListItemIcon>
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