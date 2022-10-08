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
        history
    } = props


    const status_chk = (item) => {
        if (window.sessionStorage.getItem(item)) {
            return window.location.pathname === window.sessionStorage.getItem('path');
        }
        return false
    }

    const [state, setState] = React.useState({})
    const [total, setTotal] = React.useState()

    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [search, setSearch] = React.useState(status_chk('search') ? window.sessionStorage.getItem('search') : '')

    const [ajId, setAjId] = React.useState();
    const [pointType, setPointType] = React.useState();
    const [uid, setUid] = React.useState();
    const [status, setStatus] = React.useState(status_chk('status') ? window.sessionStorage.getItem('status') : -1);

    const [open, setOpen] = React.useState(false)
    const [text, setText] = React.useState('')

    useEffect(() => {
        dataReq()
    }, [page, search, total, status])


    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const setSession = (_page, _type) => {

        //console.log(page, search);

        window.sessionStorage.setItem("page", _page ? _page : page)
        window.sessionStorage.setItem("search", search)
        window.sessionStorage.setItem("status", _type || _type === 0 ? _type : status)
        window.sessionStorage.setItem("path", window.location.pathname)

        //console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const moreBtnHandler = (d) => {
        setSession()
        history.push('/admin/earnings/adjustment/item/{0}'.format(d.id))
    }

    let data = {}

    const dataReq = () => {
        return new Promise(async (r, e) => {

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            let limit = 5

            if (page > total) {
                setPage(page - 1)
            }

            let offset = (page - 1) * limit + 1;
            // let status = -1; // -1 전체, 0 신청, 1 완료.

            let url = `/api/v1/admin/points/manage/adjustment/all/list?limit=${limit}&offset=${offset}&keyword=${search}&status=${status}`


            const headers = {
                'token': window.localStorage.getItem('token')
            }

            const res = await httpRequest('GET', url, headers, null)
            //console.log(res);

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

            //console.log(page_count);

            if (res['total'] % limit !== 0) {
                page_count += 1
            }
            page_count = Math.floor(page_count)

            setTotal(page_count)
        })
    }


    const openAlert = (text) => {
        setText(text)
        setOpen({0: false, 1: false, 2: true})
        setTimeout(function () {
            setOpen({0: false, 1: false, 2: false})
        }, 700);
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const completeAdjustment = async (ajId, pointType, uid) => {

        console.log(ajId, pointType);

        let url = `/api/v1/admin/points/manage/adjustment/complete`
        let data = {
            "id": ajId,
            "user_id" : uid,
            "point_type": pointType
        }

        const headers = {
            'token': window.localStorage.getItem('token'),
            'Content-type': 'application/json; charset=utf-8'
        }

        let res = await httpRequest('POST', url, headers, JSON.stringify(data))

        if (res['code'] > 1000) {
            alert('실패')
            return
        }

        ///console.log(res)
        setOpen(false)

        setTimeout(function () {
            window.location.reload()
        }, 700)
    }

    const handleSelChange = (e) => {

        setStatus(e.target.value);
        setPage(1)
        setSession(1, e.target.value)

        //console.log(status);
    };

    return (
        <>
            <DialogAlert open={open} handleClose={() => setOpen(false)} text={"선택한 항목의 정산 완료 하시겠습니까?"}
                         fn={() => completeAdjustment(ajId, pointType, uid)}
            />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} onClick={() => console.log('a')}>
                            정산 신청 목록
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Grid className={classes.tableWrap}>
                <Grid container spacing={3} className={classes.tableTop}>
                    <Grid item xs={12} sm={6}>

                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Select
                            labelId="select"
                            value={status}
                            onChange={handleSelChange}
                            fullWidth
                        >
                            <MenuItem value={-1}>전체</MenuItem>
                            <MenuItem value={0}>정산 신청</MenuItem>
                            <MenuItem value={1}>정산 완료</MenuItem>
                        </Select>
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
                                    <TableCell className={classes.tableCell} align="center">신청일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">닉네임</TableCell>
                                    <TableCell className={classes.tableCell} align="center">정산 포인트 / 정산 금액</TableCell>
                                    <TableCell className={classes.tableCell} align="center">은행명</TableCell>
                                    <TableCell className={classes.tableCell} align="center">계좌번호</TableCell>
                                    <TableCell className={classes.tableCell} align="center">예금주명</TableCell>
                                    <TableCell className={classes.tableCell} align="center">처리현황</TableCell>
                                    <TableCell className={classes.tableCell} align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell className={classes.tableCell}
                                                   align="center"
                                                   onClick={() => moreBtnHandler(row)}>{row.apply_at}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}>{row.nickname}</TableCell>
                                        <TableCell id={"u" + row.user_id} className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}>{numberWithCommas(row.point_quantity) + "P / " + numberWithCommas(row.point_quantity)}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}>{row.account.split("+")[0]}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}>{row.account.split("+")[1]}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}>{row.account.split("+")[2]}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}>{row.status === 1 ? "정산 완료" : "정산 신청"}</TableCell>
                                        <TableCell className={classes.tableCell} align="center">
                                            {row.status === 0 ?
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="secondary"
                                                    style={
                                                        {
                                                            backgroundColor: '#FFAE64',
                                                            color: '#041E62',
                                                            fontWeight: 'bold',
                                                        }
                                                    }
                                                    onClick={() => {
                                                        setAjId(row.id)
                                                        setPointType(row.point_type)
                                                        setUid(row.user_id)
                                                        setOpen(true)
                                                    }}
                                                >정산 완료</Button> :
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="default"
                                                    style={
                                                        {
                                                            backgroundColor: '#DDDDDD',
                                                            color: '#A6A6A6',
                                                            fontWeight: 'bold',
                                                            cursor: 'default'
                                                        }
                                                    }
                                                >정산 완료</Button>
                                            }
                                        </TableCell>
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
                                    // history.push(`/admin/earnings/adjustment/list?p=${v}&s=${search}`)
                                }}/>
                </Grid>
            </Grid>
        </>
    )
}