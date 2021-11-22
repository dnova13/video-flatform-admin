import clsx from 'clsx';
import React, { useEffect } from 'react'
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
import { httpRequest } from "../../utils/httpReq";
import { Pagination } from "@material-ui/lab";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import DialogAlert, { AlertText } from "../../utils/dialogAlert";
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Toolbar from "@material-ui/core/Toolbar";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList"
import func from "../../utils/functions";

const MyTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
        borderRadius: '2px'
    },
    indicator: {
        backgroundColor: '#041E62',
    },
})(Tabs);

const MyTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        background: "#F5F5F5",
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#041E62',
            opacity: 1,
        },
        '&$selected': {
            color: '#041E62',
            fontWeight: "bold",
            background: "#FFFFFF",
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e8e8e8',
        },
        '&:focus': {
            color: '#041E62',
        },
    },
    selected: {},
}))((props) => <Tab disableRipple {...props} />);

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

    const [status, setStatus] = React.useState(-1);
    const [sponType, setSponType] = React.useState(status_chk('sponType') ? parseInt(window.sessionStorage.getItem('sponType')) : -1);
    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [search, setSearch] = React.useState(status_chk('search') ? window.sessionStorage.getItem('search') : '')

    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false })
    const [text, setText] = React.useState('')

    const [rank, setRank] = React.useState(0)
    const [rankList, setRankList] = React.useState({})

    useEffect(() => {

        dataReq()
    }, [page, search, total, sponType])

    useEffect(() => {
        getRankInfo()
    }, [rank])


    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const setSession = (_page, _type) => {

        // console.log(page, search);

        window.sessionStorage.setItem("page", _page ? _page : page)
        window.sessionStorage.setItem("search", search)
        window.sessionStorage.setItem("path", window.location.pathname)
        window.sessionStorage.setItem("sponType", _type || _type === 0 ? _type : sponType)

        // console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const moreBtnHandler = (d) => {
        setSession()
        history.push('/admin/earnings/sponsor/item/{0}/{1}?'.format(d.video_post_id > 0 ? "video" : "creator", d.id))
    }

    let data = {}

    const dataReq = () => {
        return new Promise(async (r, e) => {

            // console.log(window.sessionStorage);

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            let limit = 5

            if (page > total) {
                setPage(page - 1)
            }

            let offset = (page - 1) * limit + 1;

            // console.log(sponType)

            let url = `/api/v1/admin/points/manage/sponsor/list?limit=${limit}&offset=${offset}&keyword=${search}&type=${sponType}`

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

    const getRankInfo = async () => {
        return new Promise(async (r, e) => {

            let limit = 5;
            let url = rank === 0 ? `/api/v1/admin/points/manage/sponsor/ing/lots/user?limit=${limit}`
                : `/api/v1/admin/points/manage/sponsor/ed/lots/user?limit=${limit}`

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

            let _data = res["data"] ? res["data"] : [];

            for (let item of _data) {

                item.total_sponsor = rank > 0 ? numberWithCommas(item.total_sponsored) : numberWithCommas(item.total_sponsoring)
                item.total_sponsor_video = rank > 0 ? numberWithCommas(item.total_sponsored_video) : numberWithCommas(item.total_sponsoring_video)
                item.total_sponsor_creator = rank > 0 ? numberWithCommas(item.total_sponsored_creator) : numberWithCommas(item.total_sponsoring_creator)
            }

            setRankList(res["data"]);
        })
    }

    const handleTabChange = (e, rank) => {
        setRank(rank);
    };

    const handleSelChange = (event) => {

        // console.log(event.target.value)

        setSponType(event.target.value);
        setPage(1)
        setSession(1, event.target.value)
    };

    const openAlert = (text) => {
        setText(text)
        setOpen({ 0: false, 1: false, 2: true })
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false })
        }, 700);
    }


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => { }}>
                            후원 내역
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper} style={{ marginTop: "15px", paddingBottom: "40px" }}>
                <Grid>
                    <MyTabs
                        value={rank}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleTabChange}
                        aria-label="disabled tabs example"
                    >
                        <MyTab label="후원을 많이 한 회원" />
                        <MyTab label="후원을 많이 받은 회원" />
                    </MyTabs>
                </Grid>
                <Grid className={classes.tableWrap} style={{ marginTop: "0px" }}>
                    <Grid style={{ marginTop: "40px" }}>
                        <TableContainer>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableCell} align="center">순위</TableCell>
                                        <TableCell className={classes.tableCell} align="center">회원 닉네임</TableCell>
                                        {
                                            rank ?
                                                <TableCell className={classes.tableCell} align="center">후원 받은 포인트</TableCell>
                                                :
                                                <TableCell className={classes.tableCell} align="center">후원한 포인트</TableCell>
                                        }
                                        <TableCell className={classes.tableCell} align="center">영상 후원 포인트</TableCell>
                                        <TableCell className={classes.tableCell} align="center">크리에이터 후원 포인트</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rankList && rankList[0] ? rankList.map((row, index) => (
                                        <TableRow key={row.id} hover>

                                            <TableCell className={classes.tableCell}
                                                align="center"
                                            >{index + 1}</TableCell>
                                            <TableCell className={classes.tableCell} align="center"
                                            >{row.nickname}</TableCell>
                                            <TableCell className={classes.tableCell} align="center"
                                            >{row.total_sponsor} P</TableCell>
                                            <TableCell className={classes.tableCell} align="center"
                                            >{row.total_sponsor_video} P</TableCell>
                                            <TableCell className={classes.tableCell} align="center"
                                            >{row.total_sponsor_creator} P</TableCell>

                                        </TableRow>
                                    )) : <TableRow></TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                            value={sponType}
                            onChange={handleSelChange}
                            fullWidth
                        >
                            <MenuItem value={-1}>전체</MenuItem>
                            <MenuItem value={0}>크리에이터 후원</MenuItem>
                            <MenuItem value={1}>영상 후원</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="input-with-icon-textfield"
                            placeholder="닉네임 검색"
                            fullWidth
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ), endAdornment: (
                                    <IconButton position="end" onClick={() => setSearch('')}>
                                        <ClearIcon />
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
                                    <TableCell className={classes.tableCell} align="center">후원일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">유형</TableCell>
                                    <TableCell className={classes.tableCell} align="left"
                                        style={{ paddingLeft: '40px' }}
                                    >상세내역</TableCell>
                                    <TableCell className={classes.tableCell} align="center">후원 포인트</TableCell>
                                    <TableCell className={classes.tableCell} align="center">회원 닉네임</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>

                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.sponsor_at}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.video_post_id > 0 ? "영상 후원" : "크리에이터 후원"}</TableCell>

                                        {row.video_post_id > 0 ?
                                            <TableCell className={classes.tableCell}
                                                align="left"
                                                style={
                                                    {
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px'
                                                    }}
                                                onClick={() => moreBtnHandler(row)}>
                                                <TableCell
                                                    style={
                                                        {
                                                            paddingTop: '0px',
                                                            paddingBottom: '0px',
                                                            borderBottom: "0px"
                                                        }}
                                                >
                                                    <img src={process.env.REACT_APP_API_URL + row.thumbnail}
                                                        height="120px" width="150px" />
                                                </TableCell>
                                                <TableCell
                                                    style={
                                                        {
                                                            paddingTop: '0px',
                                                            paddingBottom: '0px',
                                                            borderBottom: "0px",
                                                            width: "100%"
                                                        }}
                                                >
                                                    <TextField
                                                        // className={classes.marginTop30}
                                                        style={{ marginLeft: '10px' }}
                                                        fullWidth
                                                        multiline
                                                        InputProps={{
                                                            readOnly: true,
                                                            disableUnderline: true,
                                                            // classes: {input: classes.fontSize22}
                                                        }}
                                                        value={row.title + " 에 후원"}
                                                    />
                                                </TableCell>
                                            </TableCell> :
                                            <TableCell className={classes.tableCell}
                                                align="left"
                                                style={
                                                    {
                                                        paddingTop: '20px',
                                                        paddingBottom: '20px',
                                                        paddingLeft: '30px'
                                                    }}
                                                onClick={() => moreBtnHandler(row)}>

                                                {row.receiver_nickname} 에게 후원
                                            </TableCell>}
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={() => moreBtnHandler(row)}>{numberWithCommas(row.point_quantity) + " P"}</TableCell>
                                        <TableCell id={"u" + row.user_id} className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.nickname}</TableCell>

                                    </TableRow>
                                )) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid container direction="column-reverse" alignItems="flex-end" style={{ paddingTop: '20px' }}>
                <Grid item xs={12}>
                    <Pagination count={total} page={page} size="large" variant="outlined" shape="rounded"
                        color="primary"
                        onChange={(e, v) => {

                            // console.log("v", v)
                            setPage(v)
                            setSession(v)
                            // history.push(`/admin/earnings/sponsor/list?p=${v}&s=${search}`)
                        }} />
                </Grid>
            </Grid>
        </>
    )
}