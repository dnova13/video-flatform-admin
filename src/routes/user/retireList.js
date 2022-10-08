import clsx from 'clsx';
import React, { useEffect } from 'react'
import PropTypes from "prop-types";

import Link from '@material-ui/core/Link';
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
    const [retireTotal, setRetireTotal] = React.useState()
    const [category, setCategory] = React.useState(0)

    const [reasonList1, setReasonList1] = React.useState([])
    const [reasonList2, setReasonList2] = React.useState([])

    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [search, setSearch] = React.useState(status_chk('search') ? window.sessionStorage.getItem('search') : '')

    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [open, setOpen] = React.useState({ 0: false, 1: false })
    const [text, setText] = React.useState('')

    const [type, setType] = React.useState(status_chk('type') ? parseInt(window.sessionStorage.getItem('type')) : -1);


    useEffect(() => {
        dataReq()
    }, [page, total, category])

    useEffect(() => {
        getRetireCount()
    }, [page, total, category])


    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const setSession = (_page, _type) => {

        // console.log(page, search);

        window.sessionStorage.setItem("page", _page ? _page : page)
        window.sessionStorage.setItem("search", search)
        window.sessionStorage.setItem("type", _type || _type === 0 ? _type : type)
        window.sessionStorage.setItem("path", window.location.pathname)

        // console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const moreBtnHandler = (d) => {
        setSession()
        history.push('/admin/member/user/item/{0}'.format(d.id))
    }

    const getRetireCount = () => {
        return new Promise(async (r, e) => {

            // console.log(window.sessionStorage);

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }
            let url = `/api/v1/admin/user/manage/retire/count`

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

            let i = 0;
            let data = res["data"] ? res["data"] : []
            let arr1 = [
                {
                    category: 1,
                    reason: "잠깐 떠났다가 다시 돌아올게요.",
                    cnt: 0
                },
                {
                    category: 2,
                    reason: "개인정보에 대한 우려가 있어요.",
                    cnt: 0
                },
                {
                    category: 3,
                    reason: "콘텐츠의 온라인 유통에 대한 우려가 있어요",
                    cnt: 0
                },
                {
                    category: 4,
                    reason: "콘텐츠가 다양하지 않아요.",
                    cnt: 0
                }
            ]
            let arr2 = [
                {
                    category: 5,
                    reason: "콘텐츠의 질이 떨어져요",
                    cnt: 0
                },
                {
                    category: 6,
                    reason: "앱이나 서비스 이용이 불편해요.",
                    cnt: 0
                },
                {
                    category: 7,
                    reason: "광고메시지가 너무 많아요.",
                    cnt: 0
                },
                {
                    category: 8,
                    reason: "회원 혜택이 부족해요.",
                    cnt: 0
                },
            ]


            for (let item of data) {

                // console.log(item.category);
                if (item.category <= 4) {
                    arr1[item.category - 1].cnt = item.cnt;
                } else {
                    arr2[item.category - 5].cnt = item.cnt;
                }
            }

            setReasonList1(data ? arr1 : [])
            setReasonList2(data ? arr2 : [])
        })

    }

    const dataReq = () => {
        return new Promise(async (r, e) => {

            // console.log(window.sessionStorage);

            if (window.sessionStorage.path !== window.location.pathname) {
                await removeSession()
            }

            let limit = 10

            if (page > total) {
                setPage(page - 1)
            }

            let offset = (page - 1) * limit + 1;
            let url = `/api/v1/admin/user/manage/retire/list?limit=${limit}&offset=${offset}&category=${category}`

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

            let data = res['data'] ? res['data'] : []

            for (let item of data) {

                item.reason = returnRetireReason(item.category)
            }

            setState(data)

            let page_count = res['total'] / limit

            // console.log(page_count);

            if (res['total'] % limit !== 0) {
                page_count += 1
            }
            page_count = Math.floor(page_count)

            setRetireTotal(res["total"]);
            setTotal(page_count)
        })
    }

    const returnRetireReason = (category) => {

        switch (category) {

            case 1:
                return "잠깐 떠났다가 다시 돌아올게요."
            case 2:
                return "개인정보에 대한 우려가 있어요."
            case 3:
                return "콘텐츠의 온라인 유통에 대한 우려가 있어요"
            case 4:
                return "콘텐츠가 다양하지 않아요."
            case 5:
                return "콘텐츠의 질이 떨어져요"
            case 6:
                return "앱이나 서비스 이용이 불편해요."
            case 7:
                return "광고메시지가 너무 많아요."
            case 8:
                return "회원 혜택이 부족해요."
            default:
                return '';

        }
    }

    const handleSelectAllClick = (e) => {

        if (e.target.checked) {

            // console.log(state)
            const newSelecteds = state.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleClick = (event, name) => {

        const selectedIndex = selected.indexOf(name);

        // console.log(name, selectedIndex, selected)

        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        // console.log(newSelected)

        setSelected(newSelected);
    };

    const isSelected = (name) => {

        return selected.indexOf(name) !== -1;
    }

    const openAlert = (text) => {
        setText(text)
        setOpen({ 0: false, 1: false })
        setTimeout(function () {
            setOpen({ 0: false, 1: false })
        }, 700);
    }

    const handleSelChange = (e) => {

        setType(e.target.value);
        setPage(1)

        setSession(1, e.target.value)
        // console.log(status);
    };


    return (
        <>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => { }}>
                            탈퇴 사유 확인 <span style={{ color: "#A6A6A6", fontSize: "18px" }}>(총 {retireTotal}개)</span>
                        </Typography>

                    </Grid>
                </Grid>
            </Paper>
            <Paper className={clsx(classes.paper, classes.marginTop30)} style={{ width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Table className={classes.table}>
                            <TableBody>
                                {reasonList1[0] ? reasonList1.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className={classes.tableCellNotBorderPadding0} align={"left"}
                                            width={"70%"}
                                        >
                                            <h4><span style={{ color: "#FFAE64" }}>● </span>
                                                <Link style={{
                                                    cursor: "pointer"
                                                }}
                                                    onClick={() => {
                                                        setCategory(row.category)
                                                    }}
                                                >{row.reason}</Link>
                                            </h4>
                                        </TableCell>
                                        <TableCell className={classes.tableCellNotBorderPadding0} align={"left"}>
                                            <h4 style={{ color: "#FFAE64" }}>{row.cnt} 건</h4>
                                        </TableCell>
                                    </TableRow>
                                )) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Table className={classes.table}>
                            <TableBody>
                                {reasonList2[0] ? reasonList2.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className={classes.tableCellNotBorderPadding0} align={"left"}
                                            width={"70%"}
                                        >
                                            <h4><span style={{ color: "#FFAE64" }}>● </span>
                                                <Link style={{
                                                    cursor: "pointer"
                                                }}
                                                    onClick={() => {
                                                        setCategory(row.category)
                                                    }}
                                                >{row.reason}</Link>
                                            </h4>
                                        </TableCell>
                                        <TableCell className={classes.tableCellNotBorderPadding0} align={"left"}>
                                            <h4 style={{ color: "#FFAE64" }}>{row.cnt} 건</h4>
                                        </TableCell>
                                    </TableRow>
                                )) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>

            <Grid className={classes.tableWrap}>
                {/*<Grid container spacing={3} className={classes.tableTop}>
                    <Grid item xs={12} sm={4}>
                    </Grid>
                    <Grid item xs={12} sm={4}>

                    </Grid>
                    <Grid item xs={12} sm={4}>

                    </Grid>
                </Grid>*/}

                <Grid>
                    <TableContainer>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableCell} align="center">탈퇴일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">탈퇴 사유</TableCell>
                                    <TableCell className={classes.tableCell} align="center">상세 사유</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell className={classes.tableCell} align="center"
                                        >{row.create_at}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                        >{row.reason}</TableCell>
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                        >
                                            <TextField
                                                InputProps={{
                                                    readOnly: true,
                                                    disableUnderline: true, classes: { input: classes.fontSize13 }
                                                }}
                                                multiline
                                                rows={2}
                                                rowsMax={5}
                                                value={row.content ? row.content : ""}
                                            />
                                        </TableCell>
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
                            // history.push(`/admin/service/notice/list?p=${v}&s=${search}`)
                        }} />
                </Grid>
            </Grid>
        </>
    )
}