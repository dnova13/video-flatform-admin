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

    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [open, setOpen] = React.useState({ 0: false, 1: false })
    const [text, setText] = React.useState('')

    const [type, setType] = React.useState(status_chk('type') ? parseInt(window.sessionStorage.getItem('type')) : 0);


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
        window.sessionStorage.setItem("path", window.location.pathname)
        window.sessionStorage.setItem("type", _type || _type === 0 ? _type : type)

        // console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const moreBtnHandler = (d) => {
        setSession()
        history.push('/admin/report/video/item/{0}'.format(d.id))
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

            let url = `/api/v1/admin/report/list/video?limit=${limit}&offset=${offset}&keyword=${search}&category_id=${type}`

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

            for (let item of res['data'] ? res['data'] : []) {

                switch (item.category) {

                    case 1:
                        item.reason = "명예훼손/사생활 침해 및 저작권 침해 등";
                        break;
                    case 2:
                        item.reason = "음란성 또는 청소년에게 부적합한 콘텐츠";
                        break;
                    case 3:
                        item.reason = "폭력 또는 혐오스러운 콘텐츠";
                        break;
                    case 4:
                        item.reason = "불법, 유해한 위험행위 등 부적절한 콘텐츠";
                        break;
                    case 5:
                        item.reason = "기타";
                        break;
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

        // console.log(name, selectedIndex,selected)

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

        //  console.log(newSelected)

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

    const handleSelChange = (event) => {

        //  console.log(event.target.value)

        setType(event.target.value);
        setPage(1)
        setSession(1, event.target.value)
    };

    const chkBlind = (selected, _type) => {
        return new Promise(async (result, err) => {

            // console.log(selected)

            let url = _type > 0 ? "/api/v1/admin/report/chk/blind/video" : "/api/v1/admin/report/unchk/blind/video"
            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            let res;

            for (let item of selected) {

                let data = {
                    id: item
                }

                // console.log(data);
                res = await httpRequest('POST', url, headers, JSON.stringify(data))

                if (res['code'] > 1000) {
                    alert('실패')
                    return
                }
            }

            // console.log(res)
            setOpen({ 0: false, 1: false })
            // openAlert("정상 처리 되었습니다")

            setTimeout(function () {
                window.location.reload()
            }, 700)
        })
    }


    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={"블라인드 하시겠습니까?"}
                fn={() => chkBlind(selected, 1)} />
            <DialogAlert open={open[1]} handleClose={() => setOpen({ ...open, 1: false })} text={"블라인드 해제 하시겠습니까?"}
                fn={() => chkBlind(selected, 0)} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => { }}>
                            영상 신고 내역
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
                            onClick={() => {
                                if (selected.length > 0) {
                                    setOpen({ ...open, 0: true })
                                }
                            }}
                        >블라인드</Button>
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
                        >블라인드 해제</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid className={classes.tableWrap}>
                <Grid container spacing={3} className={classes.tableTop}>
                    <Grid item xs={12} sm={4}>
                        <Select
                            labelId="select"
                            value={type}
                            onChange={handleSelChange}
                            fullWidth
                        >
                            <MenuItem value={0}>전체</MenuItem>
                            <MenuItem value={1}>명예훼손/사생활 침해 및 저작권 침해 등</MenuItem>
                            <MenuItem value={2}>음란성 또는 청소년에게 부적합한 콘텐츠</MenuItem>
                            <MenuItem value={3}>폭력 또는 혐오스러운 콘텐츠</MenuItem>
                            <MenuItem value={4}>불법, 유해한 위험행위 등 부적절한 콘텐츠</MenuItem>
                            <MenuItem value={5}>기타</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="input-with-icon-textfield"
                            placeholder="제목 검색"
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
                                    <TableCell className={classes.tableCell} align="center">신고일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">신고 유형</TableCell>
                                    <TableCell className={classes.tableCell} align="center">신고 사유</TableCell>
                                    <TableCell className={classes.tableCell} align="center">신고한 영상</TableCell>
                                    <TableCell className={classes.tableCell} align="center">신고한 회원 닉네임</TableCell>
                                    <TableCell className={classes.tableCell} align="center">블라인드 유무</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell padding="checkbox">
                                            <YellowCheckbox
                                                inputProps={{ "aria-labelledby": `enhanced-table-checkbox-${index}` }}
                                                onClick={(e) => handleClick(e, row.id)}
                                                checked={isSelected(row.id)}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.create_at}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{"영상"}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.reason}</TableCell>
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
                                                <img src={row.thumbnail ? process.env.REACT_APP_API_URL + row.thumbnail : ""}
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
                                                    value={row.title}
                                                />
                                            </TableCell>
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{row.reporting_nickname}</TableCell>
                                        {row.blind_chk ?
                                            <TableCell className={classes.tableCell} align="center"
                                                onClick={() => moreBtnHandler(row)}
                                                style={
                                                    {
                                                        color: '#FFAE64',
                                                        fontWeight: 'bold'
                                                    }}
                                            >블라인드</TableCell> :
                                            <TableCell className={classes.tableCell} align="center"
                                                onClick={() => moreBtnHandler(row)}
                                                style={
                                                    {
                                                        color: '#041E62',
                                                        fontWeight: 'bold'
                                                    }}
                                            >공개</TableCell>
                                        }
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