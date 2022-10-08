import React, {useEffect} from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import NavChild from 'sideNav/child'

import {withStyles} from '@material-ui/core/styles'

const ListItems = withStyles({
    root: {
        marginTop: 2,
        "&:hover": {
            backgroundColor: '#ffeddd',
            color: '#000'
        },
    },
    selected: {
        backgroundColor: '#ffeddd !important',
        // color: 'black !important',
        /*'& span': {
            fontWeight:'bold',
        }*/
    }
})(ListItem);

export default (props) => {

    const {items, locInfo, moveLoc} = props

    // console.log(props);

    if (!items || items.length < 1 || !items.map) {
        return ''
    }

    return (
        <List style={{
            backgroundColor: '#fff',
            padding: 0,
        }}
              component="nav"
              aria-labelledby="nested-list-subheader"
        >
            {
                items.map((nav, id) => {

                    if (nav.label != '') {
                        return (
                            <div key={'list-item-iterator-id-{0}'.format(id)}>
                                <ListItems
                                    button
                                    color="inherit"
                                    underline="none"
                                    selected={nav.selected}
                                    onClick={() => nav.children ? props.handleClick(nav.name) : moveLoc(nav.link)}
                                >
                                    <ListItemIcon>{nav.icon}</ListItemIcon>
                                    <ListItemText primary={nav.label}/>
                                    {nav.children ? nav.selected ? (<ExpandLess/>) : (<ExpandMore/>) : ''}
                                </ListItems>
                                <NavChild locInfo={locInfo} children={nav.children} open={nav.selected} moveLoc={moveLoc}/>
                            </div>
                        )
                    }
                })
            }
        </List>
    )
}