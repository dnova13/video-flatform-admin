import clsx from 'clsx';
import React, {useEffect} from 'react'

import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {httpRequest} from "../../utils/httpReq";
import DialogAlert, {AlertText} from "../../utils/dialogAlert";
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';


import {deepOrange, deepPurple} from '@material-ui/core/colors';


import Link from "@material-ui/core/Link";

import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";

import {Player} from 'video-react';
import func from "../../utils/functions";
import userIcon from "../../user.png";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import {Pagination} from "@material-ui/lab";

// import 'video-react/dist/video-react.css';


export default (props) => {

    const {classes, history, match} = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    // const ava = useStyles();
    const status_chk = (item) => {
        if (window.sessionStorage.getItem(item)) {
            return window.location.pathname === window.sessionStorage.getItem('path');
        }
        return false
    }

    const [point, setPoint] = React.useState();
    const [state, setState] = React.useState({})
    const [total, setTotal] = React.useState()

    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [type, setType] = React.useState(status_chk('type') ? parseInt(window.sessionStorage.getItem('type')) : 0);

    useEffect(() => {
        getPoints()
    }, [])

    useEffect(() => {
        getDataList()
    }, [page, total, type])


    const [open, setOpen] = React.useState({0: false, 1: false, 2: false})
    const [text, setText] = React.useState('')

    const openAlert = (text) => {

        setText(text)
        setOpen({0: false, 1: false, 2: true})
        setTimeout(function () {
            setOpen({0: false, 1: false, 2: false})
        }, 700);
    }

    const setSession = (_page, _type) => {

        // console.log(page, search);

        window.sessionStorage.setItem("page", _page ? _page : page)
        // window.sessionStorage.setItem("search", search)
        window.sessionStorage.setItem("type", _type || _type === 0 ? _type : type)
        window.sessionStorage.setItem("path", window.location.pathname)

        console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }


    const moreBtnHandler = (d) => {
        setSession()
        history.push('/admin/earnings/sponsor/item/{0}/{1}?'.format(d.video_post_id > 0 ? "video" : "creator", d.id))
    }

    const getPoints = (q) => {
        return new Promise(async (r, e) => {

            console.log("match", match)

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            if (!match.params.id) {
                return
            }

            let url = `/api/v1/admin/user/manage/member/detail/sponsoring/point?user_id=${match.params.id}`

            const headers = {
                'token': window.localStorage.getItem('token')
            }

            const res = await httpRequest('GET', url, headers, null)

            console.log(res);


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

            setPoint(res["data"]);
        })
    }

    const getDataList = (q) => {
        return new Promise(async (r, e) => {

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            let limit = 5

            if (page > total) {
                setPage(page - 1)
            }

            let offset = (page - 1) * limit + 1;

            let url = `/api/v1/admin/user/manage/member/detail/sponsoring/list?user_id=${match.params.id}&limit=${limit}&offset=${offset}`

            const headers = {
                'token': window.localStorage.getItem('token')
            }

            const res = await httpRequest('GET', url, headers, null)
            console.log(res);

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

            setTotal(page_count)
        })
    }

    const numberWithCommas = (x) => {

        if (!x)
            return 0;

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    const handleSelChange = (event) => {

        console.log(event.target.value)

        setType(event.target.value);
        setPage(1)
        setSession(1, event.target.value)
    };


    return (
        <>
            {/*<DialogAlert open={open[0]} handleClose={() => setOpen({...open, 0: false})} text={"정지 하시겠습니까?"}
                         fn={() => chkBlind(match.params.id, 1)}/>
            <DialogAlert open={open[1]} handleClose={() => setOpen({...open, 1: false})} text={"정지 해제 하시겠습니까?"}
                         fn={() => chkBlind(match.params.id, 0)}/>
            <AlertText open={open[2]} handleClose={() => setOpen({...open, 2: false})} text={text} classes={classes}/>*/}
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} >
                            후원한 내역
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{fontWeight: 'bold', color: '#041E62', backgroundColor: '#E0E7F7'}}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.goBack();
                            }}
                        >뒤로가기</Button>
                    </Grid>
                </Grid>
            </Paper>
            {/* 포인트 정보 */}
            <TextField
                className={classes.marginTop30}
                style={{marginLeft: '10px', marginTop: "50px"}}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: {input: classes.fontSize22}
                }}
                value="포인트"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{width: '100%'}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="- 후원한 포인트"
                            name="sponsoring_point"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={point ? numberWithCommas(point["total_sponsoring"]) + " P" : ""}
                            InputProps={{
                                readOnly: true,
                                classes: {input: classes.paddingLT}
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="- 영상 후원 포인트"
                            name="video_sponsor"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={point ? numberWithCommas(point["total_sponsoring_video"]) + " P" : ""}
                            InputProps={{
                                readOnly: true,
                                classes: {input: classes.paddingLT}
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="- 크리에이터 후원 포인트"
                            name="creator_sponsor"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={point ? numberWithCommas(point["total_sponsoring_creator"]) + " P" : ""}
                            InputProps={{
                                readOnly: true,
                                classes: {input: classes.paddingLT}
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Grid className={classes.tableWrap}>
               {/* <Grid container spacing={3} className={classes.tableTop}>
                    <Grid item xs={12} sm={10}>

                    </Grid>
                    <Grid item xs={12} sm={2}>

                    </Grid>
                </Grid>*/}

                    <TableContainer>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableCell} align="center">사용일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">유형</TableCell>
                                    <TableCell className={classes.tableCell} align="center">상세내역</TableCell>
                                    <TableCell className={classes.tableCell} align="center">포인트</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>

                                        <TableCell className={classes.tableCell}
                                                   align="center"
                                        >{row.create_at}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                        >{row.video_post_id > 0 ? "영상 후원" : row.video_post_id === 0 ? "크리에이터 후원" : ""}</TableCell>

                                        <TableCell className={classes.tableCell}
                                                   align="center">
                                            {row.video_post_id > 0 ? `영상 ${row.title} 에 후원` : row.video_post_id === 0 ? `크리에이터 ${row.receiver_nickname}에 후원` : ""}
                                        </TableCell>
                                        <TableCell className={classes.tableCell}
                                                   align="center"
                                        >{  "- " + numberWithCommas(row.point_quantity) + " P"}</TableCell>

                                    </TableRow>
                                )) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Grid>
            <Grid container direction="column-reverse" alignItems="flex-end" style={{paddingTop: '20px'}}>
                <Grid item xs={12}>
                    <Pagination count={total} page={page} size="large" variant="outlined" shape="rounded"
                                color="primary"
                                onChange={(e, v) => {

                                    console.log("v", v)
                                    setPage(v)
                                    setSession(v)
                                    // history.push(`/admin/earnings/sponsor/list?p=${v}&s=${search}`)
                                }}/>
                </Grid>
            </Grid>
        </>
    )
}