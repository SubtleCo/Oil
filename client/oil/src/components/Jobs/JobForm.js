import React, { useState } from 'react'
import { userIdStorageKey } from '../auth/authSettings'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { endsWith } from 'lodash'

const useStyles = makeStyles(theme => ({
    outerPaper: {
        width: "90%",
        margin: "auto",
        paddingTop: "0.5em",
    },
    form: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        '& > *': {
            margin: theme.spacing(1),
            width: "80%"
        }
    },
    submitButton: {
        alignSelf: "flex-end",
        width: "25%",
        background: theme.palette.success.main
    }
}))

export const JobForm = props => {
    const classes = useStyles(props.theme);
    const userId = parseInt(sessionStorage.getItem(userIdStorageKey))
    const [formJob, setFormJob] = useState({
        title: "",
        description: "",
        type: 0,
        frequency: 0,
        created_at: new Date().toISOString().split('T')[0],
        last_completed: new Date().toISOString().split('T')[0]
    })

    const handleFormChange = e => {
        e.preventDefault()
        const newFormJob = { ...formJob }
        let newItem = e.target.value
        if (e.target.name.includes("Id")) newItem = parseInt(newItem)
        newFormJob[e.target.name] = newItem
        setFormJob(newFormJob)
    }

    return (
        <div className="jobForm">
            <Paper className={classes.outerPaper} elevation={3}>
                <FormControl className={classes.form} noValidate autoComplete="off">
                    <h2>New Job</h2>
                    <TextField onChange={handleFormChange}
                        value={formJob.title}
                        id="title"
                        name="title"
                        label="Title"
                        aria-label="Title"
                        variant="outlined" />
                    <TextField onChange={handleFormChange}
                        value={formJob.description}
                        id="description"
                        name="description"
                        label="Description"
                        aria-label="Description"
                        variant="outlined" />
                    <TextField onChange={handleFormChange}
                        value={formJob.frequency}
                        type="number"
                        id="frequency"
                        name="frequency"
                        label="Frequency (Days)"
                        aria-label="Frequency (Days)"
                        variant="outlined" />
                    <TextField
                        id="last_completed"
                        label="Last time you did this"
                        name="last_completed"
                        aria-label="last date completed"
                        type="date"
                        variant="outlined"
                        onChange={handleFormChange}
                        value={formJob.last_completed}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="type"
                        select
                        name="type"
                        labelId="test"
                        variant="outlined"
                        label="Type"
                        onChange={handleFormChange}
                        value={formJob.type}>
                        <MenuItem value={1}>Get</MenuItem>
                        <MenuItem value={2}>Job</MenuItem>
                        <MenuItem value={3}>Types</MenuItem>
                    </TextField>
                    <Button variant="contained" className={classes.submitButton}>Save</Button>
                </FormControl>
            </Paper>
        </div>
    )


}