import React, {useEffect} from 'react'

import {makeStyles} from '@material-ui/core/styles';

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'

const useStyles = makeStyles((theme) => ({

    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,

    },
    nested: {
        paddingLeft: theme.spacing(4),
        backgroundColor: '#fbf6f2',
        '&.Mui-selected': {
            backgroundColor: '#ffeddd',
            '& span': {
                fontWeight: 'bold',
            }
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#ffeddd',
        },
        "&:hover": {
            backgroundColor: '#ffeddd',
            color: '#000',
            /*'& span': {
                fontWeight: 'bold',
            }*/
        },
    },
}))

export default (props) => {

    const classes = useStyles()
    const {children, locInfo, open, moveLoc} = props

    if (!children || children.length < 1) {
        return ''
    }

    return (
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {
                    children.map((child, childIdx) => {

                        return (
                            <ListItem
                                key={childIdx}
                                button
                                color="inherit"
                                underline="none"
                                className={classes.nested}
                                selected={open && child.name === locInfo.child}
                                onClick={() => moveLoc(child.link)}
                            >
                                <ListItemIcon></ListItemIcon>
                                <ListItemText primary={child.label}/>
                            </ListItem>
                        )
                    })
                }
            </List>
        </Collapse>
    )
}