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

import Toolbar from "@material-ui/core/Toolbar";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList"
import MenuItem from "@material-ui/core/MenuItem";
import func from "../../utils/functions";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import UncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

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
    const [listTotal, setListTotal] = React.useState()


    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [search, setSearch] = React.useState(status_chk('search') ? window.sessionStorage.getItem('search') : '')

    const [selected, setSelected] = React.useState([]);
    const [validate, setValidate] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [open, setOpen] = React.useState({ 0: false, 1: false })
    const [text, setText] = React.useState('')

    const [type, setType] = React.useState(status_chk('type') ? parseInt(window.sessionStorage.getItem('type')) : -1);


    useEffect(() => {
        dataReq()
    }, [page, search, total, type])


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
        history.push('/admin/member/apply/item/{0}'.format(d.user_id))
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
            let url = `/api/v1/admin/user/manage/creator/apply/list?limit=${limit}&offset=${offset}&status=${type}&keyword=${search}`

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

            setListTotal(res['total'])
            setTotal(page_count)
        })
    }

    const handleSelectAllClick = (e) => {

        if (e.target.checked) {

            // console.log(state)
            const newSelecteds = state.map((n) => n.user_id);
            const newValidate = state.map((n) => n.copyright);

            // console.log(newSelecteds)
            setSelected(newSelecteds);
            setValidate(newValidate);
            return;
        }
        setSelected([]);
    };


    const handleClick = (event, name, validation) => {

        const selectedIndex = selected.indexOf(name);

        // console.log(name, selectedIndex, selected, validate)

        let newSelected = [];
        let newValidate = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
            newValidate = newValidate.concat(validate, validation);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newValidate = newValidate.concat(validate.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newValidate = newValidate.concat(validate.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
            newValidate = newValidate.concat(
                validate.slice(0, selectedIndex),
                validate.slice(selectedIndex + 1)
            );
        }

        // console.log(newSelected)
        setSelected(newSelected);
        setValidate(newValidate);
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

    const chkAuth = (selected, _type) => {
        return new Promise(async (result, err) => {

            // console.log(selected)
            setOpen({ 0: false, 1: false })

            let url = _type > 0 ? "/api/v1/admin/user/manage/creator/apply/approve" : "/api/v1/admin/user/manage/creator/apply/reject"
            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            let res;

            for (let item of selected) {

                let data = {
                    id: item
                }

                res = await httpRequest('POST', url, headers, JSON.stringify(data))
                // console.log(res)

                if (res['code'] > 1000) {
                    alert('실패')
                    return
                }
            }

            // openAlert("정상 처리 되었습니다")
            setTimeout(function () {
                window.location.reload()
            }, 700)
        })
    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={"승인 하시겠습니까?"}
                fn={() => chkAuth(selected, 1)} />
            <DialogAlert open={open[1]} handleClose={() => setOpen({ ...open, 1: false })} text={"승인 거부 하시겠습니까?"}
                fn={() => chkAuth(selected, 0)} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => { }}>
                            크리에이터 목록 <span style={{ color: "#A6A6A6", fontSize: "18px" }}> (총 {listTotal}개)</span>
                        </Typography>
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

                                // console.log(selected, validate);
                                for (let val of validate) {
                                    if (!val) {
                                        alert("저작권에 동의 하지 않은 신청은 승인이 불가능 합니다.\n확인 후 다시 선택해주세요.")
                                        return
                                    }
                                }

                                if (selected.length > 0) {
                                    setOpen({ ...open, 0: true })
                                }
                            }}
                        >승인</Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (selected.length > 0) {
                                    setOpen({ ...open, 1: true })
                                }
                            }}
                        >승인 거부</Button>
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
                            value={type}
                            onChange={handleSelChange}
                            fullWidth
                        >
                            <MenuItem value={-1}>전체</MenuItem>
                            <MenuItem value={0}>승인 대기</MenuItem>
                            <MenuItem value={1}>승인 완료</MenuItem>
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
                                    <TableCell padding="checkbox">
                                        <YellowCheckbox
                                            className={classes.tableCell}
                                            indeterminate={selected.length > 0 && selected.length < state.length}
                                            checked={state.length > 0 && selected.length === state.length}
                                            onChange={handleSelectAllClick}
                                            inputProps={{ "aria-label": "select all post" }}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tableCell} align="center">신청일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">저작권 동의</TableCell>
                                    <TableCell className={classes.tableCell} align="center">회원 닉네임</TableCell>
                                    <TableCell className={classes.tableCell} align="center">회원 이름</TableCell>
                                    <TableCell width={"50%"} className={classes.tableCell} align="center">활동
                                        사진</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell padding="checkbox">
                                            <YellowCheckbox
                                                inputProps={{ "aria-labelledby": `enhanced-table-checkbox-${index}` }}
                                                onClick={(e) => handleClick(e, row.user_id, row.copyright)}
                                                checked={isSelected(row.user_id)}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.create_at}
                                            {row.status > 0 ?
                                                <h4 style={{ color: "#FFAE64" }}>승인 완료</h4> :
                                                <h4 style={{ color: "#041E62" }}>승인 대기</h4>
                                            }
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>
                                            {row.copyright ?
                                                <CheckCircleIcon style={{ color: "#606060" }} />
                                                : <UncheckedIcon style={{ color: "#606060" }} />
                                            }
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.nickname}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.name}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>
                                            {/*<Grid container spacing={3}>
                                                {row.images ? row.images.map((img, idx) => (

                                                    <Grid item xs={12} sm={4}>
                                                        <img height={"150px"}
                                                             src={process.env.REACT_APP_API_URL + img}/>
                                                    </Grid>

                                                )) : ""}
                                            </Grid>*/}
                                            <Table>
                                                <TableBody>
                                                    {row.images ?
                                                        <TableRow>
                                                            <TableCell width={"33.3%"}
                                                                className={classes.tableCellNotBorder}
                                                                align="left">
                                                                {row.images[0] ?
                                                                    <img width={"100%"} height={"130px"}
                                                                        src={process.env.REACT_APP_API_URL + row.images[0]} />
                                                                    : ""}
                                                            </TableCell>
                                                            <TableCell width={"33.3%"}
                                                                className={classes.tableCellNotBorder}
                                                                align="left">
                                                                {row.images[1] ?
                                                                    <img width={"100%"} height={"130px"}
                                                                        src={process.env.REACT_APP_API_URL + row.images[1]} />
                                                                    : ""}
                                                            </TableCell>
                                                            <TableCell width={"33.3%"}
                                                                className={classes.tableCellNotBorder}
                                                                align="left">
                                                                {row.images[2] ?
                                                                    <img width={"100%"} height={"130px"}
                                                                        src={process.env.REACT_APP_API_URL + row.images[2]} />
                                                                    : ""}
                                                            </TableCell>
                                                        </TableRow>
                                                        : <TableRow></TableRow>}
                                                </TableBody>
                                            </Table>
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