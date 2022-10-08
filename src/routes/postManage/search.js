import clsx from 'clsx';
import React, {useEffect} from 'react'
import PropTypes from "prop-types";


import Moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import {httpRequest} from "../../utils/httpReq";
import {Pagination} from "@material-ui/lab";
import Checkbox from "@material-ui/core/Checkbox";
import {withStyles} from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import DialogAlert, {AlertText} from "../../utils/dialogAlert";

import Toolbar from "@material-ui/core/Toolbar";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList"
import MenuItem from "@material-ui/core/MenuItem";
import func from "../../utils/functions";
import {Player} from 'video-react';
import HLSSource from '../../components/HLSSource';

const YellowCheckbox = withStyles({
    root: {
        color: "primary",
        '&$checked': {
            color: "#FFAE64",
        },
    },
    checked: {},
})(Checkbox);


export default (props) => {

    const {
        classes,
        history,
        match,
        style,
        modalOpen,
        modalHandler,
        addVideos,
        videos,
        deleteVideos,
        unchkVideos,
        initialSelect
    } = props

    //  console.log(props)


    const status_chk = (item) => {
        if (window.sessionStorage.getItem(item)) {
            return window.location.pathname === window.sessionStorage.getItem('path');
        }
        return false
    }

    const [state, setState] = React.useState({})
    const [total, setTotal] = React.useState()
    const [listTotal, setListTotal] = React.useState()

    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [search, setSearch] = React.useState(status_chk('search') ? window.sessionStorage.getItem('search') : '')

    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [adding, setAdding] = React.useState(videos);

    const [open, setOpen] = React.useState({0: false, 1: false})
    const [text, setText] = React.useState('')

    const [type, setType] = React.useState(status_chk('type') ? parseInt(window.sessionStorage.getItem('type')) : 0);
    // const [allChk, setAllChk] = React.useState([]);


    useEffect(() => {
        dataReq()
    }, [page, search, total, type])


    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const setSession = (_page, _type) => {
        //
        // console.log(page, search);
        //
        // window.sessionStorage.setItem("page", _page ? _page : page)
        // window.sessionStorage.setItem("search", search)
        // window.sessionStorage.setItem("path", window.location.pathname)
        // window.sessionStorage.setItem("type", _type || _type === 0 ? _type : type)
        //
        // console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const moreBtnHandler = (d) => {
        setSession()
        // history.push('/admin/post/postList/item/{0}'.format(d.id))
    }

    let data = {}

    const dataReq = () => {
        return new Promise(async (r, e) => {

            //   console.log(window.sessionStorage);

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            let limit = 5

            if (page > total) {
                setPage(page - 1)
            }

            let offset = (page - 1) * limit + 1;

            let url =
                `/api/v1/admin/post/manage/list/noBlind?limit=${limit}&offset=${offset}&keyword=${search}`
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

            setState(res['data'] ? res['data'] : [])

            let page_count = res['total'] / limit

            console.log(page_count);

            if (res['total'] % limit !== 0) {
                page_count += 1
            }
            page_count = Math.floor(page_count)

            setListTotal(res['total'])
            setTotal(page_count)
        })
    }

    const handleSelectAllClick = (e) => {

        if (e.target.checked) {

            console.log(state)
            const newVideos = state.map((n) => n);
            const newSelecteds = state.map((n) => n.id);

            setAdding(newVideos);
            setSelected(newSelecteds);
            return;
        } else {

        }

        // setSelected([]);
        // addVideos([]);
    };


    const handleClick = (event, id, val) => {

        console.log(id);
        // const selectedIndex = selected.indexOf(id);
        const selectedIndex = adding.findIndex(obj => obj.id === id)

        console.log(id, selectedIndex, adding)
        console.log("video : ", val)

        let newSelected = [];
        let newVideo = [];
        // let newVideos = videos;

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
            newVideo = newVideo.concat(adding, val);
            // newVideos.push(val);

        }
        else {

            if (adding[selectedIndex].parent_id) {
                console.log("unchk",id);
                console.log(unchkVideos)
                unchkVideos.add(id);
            }
        }

        if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newVideo = newVideo.concat(adding.slice(1));

        } else if (selectedIndex === adding.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newVideo = newVideo.concat(adding.slice(0, -1));

        } else if (selectedIndex > 0) {

            newSelected = newSelected.concat(
                adding.slice(0, selectedIndex),
                adding.slice(selectedIndex + 1)
            );

            newVideo = newVideo.concat(
                adding.slice(0, selectedIndex),
                adding.slice(selectedIndex + 1)
            );
        }

        console.log("newSelected ", newSelected)
        // console.log(newVideos);

        setSelected(newSelected);
        setAdding(newVideo);
    };

    const isSelected = (id) => {

        if (adding.findIndex(obj => obj.id === id) !== -1) {
            // document.querySelector(`#t${id}`).style.backgroundColor = "#E0E7F7"
            return true;
        }

        else {
            return false;
        }

        // return videos.findIndex(obj => obj.id === id) !== -1
    }

    const openAlert = (text) => {
        setText(text)
        setOpen({0: false, 1: false})
        setTimeout(function () {
            setOpen({0: false, 1: false})
        }, 700);
    }

    const handleSelChange = (event) => {

        console.log(event.target.value)

        setType(event.target.value);
        setPage(1)
        setSession(1, event.target.value)
    };

    const addVideo = (e) => {

        // console.log("vide ",videos);
        // console.log("adding ", adding);
        // console.log("selected ", selected);
        // console.log("deling",unchkVideos)

        addVideos(adding);
        setOpen({0: false, 1: false, 2: false})
        initialSelect([])
        modalHandler(false);
    }

    /* 모달 동작 함수 */
    const handleClose = (e) => {
        modalHandler(false);
    };


    const clickChkBox = (e, row) => {
        e.preventDefault();
        document.querySelector(`#c${row.id}`).click()
    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({...open, 0: false})} text={"추가 하시겠습니까?"}
                         fn={() => addVideo()}/>
            <Paper className={classes.modalPaper} style={style}>
                <Grid container spacing={3}
                >
                    <Grid item xs={12} sm={10}>

                    </Grid>
                    <Grid item xs={12} sm={2} align={"right"}>
                        <IconButton
                            onClick={handleClose}
                        >
                            <ClearIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} onClick={() => console.log('a')}>
                            게시물 목록 <span style={{color: "#A6A6A6", fontSize: "18px"}}> (총 {listTotal}개)</span>
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
                            onClick={(e) => {

                                    // if (selected.length > 0) {
                                        setOpen({...open, 0: true})
                                    // }
                                }
                            }
                        >추가</Button>
                    </Grid>
                </Grid>
                <Grid className={classes.tableWrap}>
                    <Grid container spacing={3} className={classes.tableTop}>
                        <Grid item xs={12} sm={4}>

                        </Grid>
                        <Grid item xs={12} sm={4}>

                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="input-with-icon-textfield"
                                placeholder="검색"
                                fullWidth
                                value={search}
                                onChange={e => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search/>
                                        </InputAdornment>
                                    ), endAdornment: (
                                        <IconButton position="end" onClick={() => setSearch('')}>
                                            <ClearIcon/>
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid>
                        <TableContainer>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            {/* <YellowCheckbox
                                                className={classes.tableCell}
                                                indeterminate={selected > 0 && selected.length < state.length}
                                                checked={state.length > 0 && selected.length === state.length}
                                                onChange={handleSelectAllClick}
                                                inputProps={{"aria-label": "select all post"}}
                                                color="primary"
                                            />*/}
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="center">등록일</TableCell>
                                        <TableCell className={classes.tableCell} align="center">작성자</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   style={{paddingLeft: '40px'}}
                                        >제목</TableCell>
                                        <TableCell className={classes.tableCell} align="center">조회수</TableCell>
                                        <TableCell className={classes.tableCell} align="center">평점</TableCell>
                                        <TableCell className={classes.tableCell} align="center">박수</TableCell>
                                        <TableCell className={classes.tableCell} align="center">댓글</TableCell>
                                        <TableCell className={classes.tableCell} align="center">찜</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state[0] ? state.map((row, index) => (

                                        <TableRow id={"t" + row.id} key={row.id} hover
                                                  style={
                                                      isSelected(row.id) ? {backgroundColor:"#E0E7F7"}:{backgroundColor:"white"}
                                                  }
                                        >
                                            <TableCell padding="checkbox">
                                                <YellowCheckbox
                                                    id={"c" + row.id}
                                                    inputProps={{"aria-labelledby": `enhanced-table-checkbox-${index}`}}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleClick(e, row.id, row)
                                                        !isSelected(row.id) ?
                                                            document.querySelector(`#t${row.id}`).style.backgroundColor = "#E0E7F7" :
                                                            document.querySelector(`#t${row.id}`).style.backgroundColor = "white"
                                                    }}
                                                    checked={isSelected(row.id)}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >
                                                {row.create_at}
                                            </TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >{row.nickname}</TableCell>

                                            <TableCell className={classes.tableCell}
                                                       align="left"
                                                       style={
                                                           {
                                                               paddingTop: '10px',
                                                               paddingBottom: '10px'
                                                           }}

                                            >
                                                <TableCell
                                                    style={
                                                        {
                                                            paddingTop: '0px',
                                                            paddingBottom: '0px',
                                                            borderBottom: "0px"
                                                        }}
                                                >
                                                    <Player
                                                        poster={row.thumbnail ? process.env.REACT_APP_API_URL + row.thumbnail : ""}
                                                        fluid={false} width={220} height={120} controls
                                                    >
                                                        <HLSSource
                                                            isVideoChild
                                                            inactive={true}
                                                            src={process.env.REACT_APP_VIDEO_URL + row.video}
                                                        />
                                                    </Player>
                                                    {/*<img src={process.env.REACT_APP_API_URL + row.thumbnail}*/}
                                                    {/*     height="100px" width="120px"/>*/}

                                                </TableCell>
                                                <TableCell
                                                    style={
                                                        {
                                                            paddingTop: '0px',
                                                            paddingBottom: '0px',
                                                            borderBottom: "0px",
                                                            width:"100%"
                                                        }}
                                                    onClick={(e) => {
                                                        clickChkBox(e, row)
                                                    }}
                                                >
                                                    <TextField
                                                        // className={classes.marginTop30}
                                                        style={{marginLeft: '10px'}}
                                                        fullWidth
                                                        multiline
                                                        InputProps={{
                                                            readOnly: true,
                                                            disableUnderline: true,
                                                            // classes: {input: classes.fontSize22}
                                                        }}
                                                        value={row.title}
                                                    />
                                                    {/*{row.title}*/}
                                                </TableCell>
                                            </TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >{row.view_cnt}</TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >{row.score}</TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >{row.like_cnt}</TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >{row.reply_cnt}</TableCell>
                                            <TableCell className={classes.tableCell}
                                                       align="center"
                                                       onClick={(e) => {
                                                           clickChkBox(e, row)
                                                       }}
                                            >{row.dibs_cnt}</TableCell>

                                        </TableRow>
                                    )) : <TableRow></TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <Grid container direction="column-reverse" alignItems="flex-end" style={{paddingTop: '20px'}}>
                    <Grid item xs={12}>
                        <Pagination count={total} page={page} size="large" variant="outlined" shape="rounded"
                                    color="primary"
                                    onChange={(e, v) => {

                                        console.log("v", v)
                                        setPage(v)
                                        // setSelected([]);
                                        // setSession(v)
                                        // history.push(`/admin/service/notice/list?p=${v}&s=${search}`)
                                    }}/>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}