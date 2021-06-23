// This module is responsible for the search bar on the "Folks" view
//  as well as displaying the list returned on search
// From here, users can invite friends

import React, { useContext, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { PeopleContext } from './PeopleProvider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        margin: "2vh",
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    searchLabel: {
        marginTop: "2vh"
    },
    foundList: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(1)
    }
}))

export const PeopleSearch = props => {
    const [searchKey, setSearchKey] = useState("")
    const classes = useStyles(props.theme)
    const { searchPeople, resetSearch, foundPeople, inviteUser, getFriendPairs } = useContext(PeopleContext)

    // handle state change of search key
    const handleSearchChange = e => {
        const newKey = e.target.value
        setSearchKey(newKey)
    }

    // Send API call and reset search key
    const handleSubmit = e => {
        if (searchKey !== "") {
            e.preventDefault()
            searchPeople(searchKey)
            setSearchKey("")
        }
    }

    // Send invite, then get all friend pairs and reset the foundPeople list
    const handleInvite = e => {
        inviteUser(e.currentTarget.id)
            .then(() => {
                resetSearch()
                getFriendPairs()
            })
    }

    useEffect(() => {
        resetSearch()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Typography align={"center"} variant={"h5"} className={classes.searchLabel}>Find a friend</Typography>
            <Paper component="form" className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder="email or username"
                    value={searchKey}
                    inputProps={{ 'aria-label': 'email or username' }}
                    onChange={handleSearchChange}
                    required
                />
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton onClick={handleSubmit} type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            {/* Only return the below Paper component if the "foundPeople" list is not empty */}
            {!!foundPeople.length && <Paper className={classes.foundList} elevation={3}>
                <List>
                    {
                        foundPeople.map(p => {
                            return (
                                <ListItem key={p.id}>
                                    <ListItemText primary={p.first_name + ' ' + p.last_name} />
                                    <ListItemIcon>
                                        <Fab onClick={handleInvite} id={p.id} color="secondary" aria-label="invite">
                                            <AddIcon />
                                        </Fab>
                                    </ListItemIcon>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Paper>}

        </>
    )
}