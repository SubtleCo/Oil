import React, { useState } from 'react'
import { userIdStorageKey } from '../auth/authSettings'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: "80%"
        }
    }
}))

export const JobForm = props => {
    const classes = useStyles(props.theme);
    const userId = parseInt(sessionStorage.getItem(userIdStorageKey))
    const [formJob, setFormJob] = useState({
        title: "",
        description: "",
        type: 0,
        created_by: 0,
        frequency: 0,
        created_at: new Date().toISOString().split('T')[0],
        last_completed: new Date().toISOString().split('T')[0],
        last_completed_by: userId,
        users: [userId]
    })

    const handleFormChange = e => {
        e.preventDefault()
        const newFormJob = {...formJob}
        let newItem = e.target.value
        if (e.target.id.includes("Id")) newItem = parseInt(newItem)
        newFormJob[e.target.id] = newItem
        setFormJob(newFormJob)
    }

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField onChange={handleFormChange} value={formJob.title} id="title" label="Title" aria-label="Title" variant="outlined" />
            <TextField onChange={handleFormChange} value={formJob.description} id="description" label="Description" aria-label="Description" variant="outlined" />
            <TextField
                id="last_completed"
                label="Last time you did this"
                type="date"
                onChange={handleFormChange}
                value={formJob.last_completed}
                InputLabelProps={{
                    shrink: true,
                }}
            />


        </form>
    )


}