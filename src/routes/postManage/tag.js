import clsx from 'clsx';
import React, { useEffect } from 'react'

import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { httpRequest } from "../../utils/httpReq";
import DialogAlert, { AlertText } from "../../utils/dialogAlert";
import { makeStyles } from '@material-ui/core/styles';


import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CloseIcon from '@material-ui/icons/Close';

import Avatar from '@material-ui/core/Avatar';
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import IconEdit from "../../edit.png";


import { deepOrange, deepPurple } from '@material-ui/core/colors';


import Link from "@material-ui/core/Link";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";

import func from "../../utils/functions";

// import 'video-react/dist/video-react.css';


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: "flex",
    },
    tabs: {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `10px 10px 10px 10px`,
        width: "200px",
    },
    tab: {
        '&:hover': {
            backgroundColor: "#E0E7F7",
            opacity: 1,
        },
        '&.Mui-selected': {
            backgroundColor: '#E0E7F7',
            fontWeight: "bold",
        }
    }
}));

const tagInputStyles = makeStyles((theme) => ({
    root: {
        padding: "15px",
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        /*'&:hover': {
            backgroundColor: "#FFEDDD",
            opacity: 1,
        },*/
        /*'&.Mui-selected': {
            backgroundColor: '#E0E7F7',
        },*/
        /*'&:selected': {
            backgroundColor : "#E0E7F7",
            opacity: 1,
        },*/
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1
    },
    iconButton: {
        padding: 10
    },
}));


export default (props) => {

    const CHARACTER_LIMIT = 100;

    const { classes, history, match } = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
    const tabStyle = useStyles();
    const tagInput = tagInputStyles();

    // const ava = useStyles();
    // const [list, setList] = React.useState();

    const [menu, setMenu] = React.useState(window.location.pathname.includes("recommend") ? 0 : 1);
    const [idx, setIdx] = React.useState();
    const [removeIdx, setRemoveIdx] = React.useState(-1);
    const [removeEv, setRemoveEv] = React.useState(false);
    const [state, setState] = React.useState();
    const [selected, setSelected] = React.useState([]);


    useEffect(() => {
        getTags()
    }, [menu])

    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false })
    const [text, setText] = React.useState('')

    const openAlert = (text) => {

        setText(text)
        setOpen({ 0: false, 1: false, 2: true })
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false })
        }, 700);
    }

    const getTags = (type, idx, val) => {
        return new Promise(async (r, e) => {

            // console.log(removeIdx)
            let arr = [];

            if (!type) {

                let url = menu === 0 ? "/api/v1/tags/recommend" : "/api/v1/tags/search"
                const headers = {
                    'token': window.localStorage.getItem('token')
                }

                const res = await httpRequest('GET', url, headers, null)
                // console.log(res);

                if (!res['success']) {
                    if (res['code'] !== 1001) {

                        if (res['code'] === 1008) {
                            func.removeToken()
                        }

                        // removeToken()
                        alert('불러오기 실패')
                        return
                    }
                }

                let data = res["data"];
                // data = null;

                for (let i = 0; i < 10; i++) {

                    let tag = {
                        id: data ? data[i] ? data[i].id : null : null,
                        tag: data ? data[i] ? data[i].tag : "" : "",
                    }

                    arr.push(tag)
                }

                // console.log(arr);

                setState(arr)
            }
        })
    }


    const numberWithCommas = (x) => {

        if (!x)
            return 0;

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const handleSelected = (event, name) => {

        // console.log("sel; ", name);

        const selectedIndex = selected.indexOf(name);

        let newSelected = [];

        if (selectedIndex > -1) {
            return
        }

        if (selectedIndex === -1) {

            // console.log("!!!!")
            newSelected = newSelected.concat(selected, name);
        }

        // console.log(newSelected);

        setSelected(newSelected);

        // console.log(selected);
    };


    const chkSave = (id, _type) => {
        setOpen({ 0: false, 1: false, 2: false })

        return new Promise(async (result, err) => {

            let arrTag = []

            for (let a of state) {

                if (a.tag) {
                    arrTag.push(a.tag);
                }
            }

            if (arrTag.length < 1) {
                alert("태그를 등록하세요.")
                return;
            }

            let url = menu === 1 ? "/api/v1/admin/tags/owner/register" : "/api/v1/admin/tags/recommend/register"
            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            let data = {
                tags: arrTag,
                del_tags: selected ? selected : []
            }

            let res = await httpRequest('POST', url, headers, JSON.stringify(data))

            if (res['code'] > 1000) {
                alert('실패')
                return
            }

            // console.log(res)

            openAlert("정상 처리 되었습니다")
            setTimeout(function () {
                window.location.reload()
            }, 700)
        })
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const handleMenuChange = (e, newValue) => {

        setMenu(newValue);
        setRemoveIdx(-1);
    };

    const changeValue = (e) => {


    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={"저장 하시겠습니까?"}
                fn={() => chkSave(idx, 1)} />
            <AlertText open={open[2]} handleClose={() => setOpen({ ...open, 2: false })} text={text} classes={classes} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => {
                            }}>
                            해시 태그 관리
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            style={
                                {
                                    backgroundColor: '#FFAE64'
                                }
                            }
                            onClick={() => {
                                setOpen({ ...open, 0: true })
                            }}
                        >저장</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={1} style={{ marginTop: "30px" }}>
                <Grid item xs={12} sm={3}>
                    <div className={tabStyle.root}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={menu}
                            onChange={handleMenuChange}
                            aria-label="Vertical tabs example"
                            className={tabStyle.tabs}
                            indicatorColor={""}
                        >
                            <Tab label="관리자 추천 태그"
                                {...a11yProps(1)}
                                className={tabStyle.tab}
                                style={{
                                    borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
                                }}
                                onClick={() => {
                                    history.push('/admin/post/tag/recommend')
                                }}
                            />
                            <Tab label="영상 해시 태그"
                                className={tabStyle.tab}
                                {...a11yProps(2)}
                                onClick={() => {
                                    history.push('/admin/post/tag/com')
                                }}
                            // className={tabStyle.tab}
                            />
                        </Tabs>

                    </div>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper className={clsx(classes.paper)}
                        style={{
                            width: '100%',
                            backgroundColor: '#F5F5F5'
                        }}>
                        {state ? state.map((tag, idx) => (
                            <Paper key={idx}
                                // component="form"
                                className={tagInput.root}
                                style={{
                                    marginBottom: "10px",
                                }}
                                onClick={(e) => {
                                    // e.preventDefault();
                                    // console.log(document.getElementById("tag"))
                                    let pen = document.querySelectorAll(".pencil");
                                    let paper = document.querySelectorAll(".MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-9 > div > div");

                                    paper.forEach((tag, i) => {
                                        tag.style.backgroundColor = "white"
                                        pen[i].style.backgroundColor = "#FFEDDD"
                                    })
                                    paper[idx].style.backgroundColor = "#FFEDDD";
                                    pen[idx].style.backgroundColor = "white"
                                }}
                            >
                                <Avatar src={IconEdit}
                                    className={"pencil"}
                                    style={{
                                        color: "white",
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#FFEDDD",
                                        marginBottom: "10px",

                                    }}>
                                </Avatar>
                                <TextField
                                    name={"tag"}
                                    className={tagInput.input}
                                    value={tag["tag"] ? tag["tag"] : ""}
                                    inputProps={{
                                        maxlength: CHARACTER_LIMIT
                                    }}
                                    helperText={`${tag["tag"].length}/${CHARACTER_LIMIT}`}
                                    onChange={(e) => {

                                        // console.log("see!!!!!",tag.id)

                                        if (tag.id) {
                                            handleSelected(e, tag.id)
                                        }

                                        let arr = [...state]

                                        arr[idx]["tag"] = e.target.value

                                        setState(arr);
                                    }}
                                    placeholder="입력"
                                />

                                <IconButton
                                    className={tagInput.iconButton}
                                    onClick={(e) => {

                                        if (tag.id)
                                            handleSelected(e, tag.id)
                                        let arr = [...state]

                                        arr.splice(idx, 1);
                                        arr.push({ id: null, tag: "" })

                                        setState(arr);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Paper>
                        )) : ""}

                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}
