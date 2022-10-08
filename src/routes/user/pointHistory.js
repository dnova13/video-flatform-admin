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

import flIcon from "../../flatform.png";


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
        getPointsList()
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

        // console.log(window.sessionStorage)
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

            // console.log("match", match)

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            if (!match.params.id) {
                return
            }

            let url = `/api/v1/admin/user/manage/member/detail/point/quantity?user_id=${match.params.id}`

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

            setPoint(res["data"]);
        })
    }

    const getPointsList = (q) => {
        return new Promise(async (r, e) => {

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            let limit = 5

            if (page > total) {
                setPage(page - 1)
            }

            let offset = (page - 1) * limit + 1;

            let url = `/api/v1/admin/user/manage/member/detail/point/list?user_id=${match.params.id}&type=${type}&limit=${limit}&offset=${offset}`


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

            // console.log(page_count);

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

        // console.log(event.target.value)

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
                            포인트 내역
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
                            label="보유 포인트"
                            name="own_point"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={point ? numberWithCommas(point["total_points"]) + " P" : ""}
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
                            label="사용 포인트"
                            name="using_point"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={point ? numberWithCommas(point["total_using"]) + " P" : ""}
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
                <Grid container spacing={3} className={classes.tableTop}>
                    <Grid item xs={12} sm={10}>

                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Select
                            labelId="select"
                            value={type}
                            onChange={handleSelChange}
                            fullWidth
                        >
                            <MenuItem value={0}>전체</MenuItem>
                            <MenuItem value={1}>충전</MenuItem>
                            <MenuItem value={2}>후원</MenuItem>
                            <MenuItem value={3}>정산</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid>
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
                                                   >{row.type === 1 ? "충전" : row.type === 2 ? "후원" : row.type === 3 ? "정산" : ""}</TableCell>

                                        <TableCell className={classes.tableCell}
                                                   align="center">
                                            {row.type === 1 ? `포인트 충전 (${row.detail})`
                                                : row.type === 2 ? `${row.detail} 에게 후원`
                                                : row.type === 3 ? `${row.detail}` : ""}
                                        </TableCell>
                                        <TableCell className={classes.tableCell}
                                                   align="center"
                                                   >{ (row.type === 1 ? "+ " : "- ") + numberWithCommas(row.point_quantity) + " P"}</TableCell>

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
                                    setSession(v)
                                    // history.push(`/admin/earnings/sponsor/list?p=${v}&s=${search}`)
                                }}/>
                </Grid>
            </Grid>
        </>
    )
}