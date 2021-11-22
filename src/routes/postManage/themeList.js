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
    const [themeTotal, setThemeTotal] = React.useState(0)

    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)
    const [search, setSearch] = React.useState(status_chk('search') ? window.sessionStorage.getItem('search') : '')

    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [open, setOpen] = React.useState(false)
    const [text, setText] = React.useState('')

    useEffect(() => {
        dataReq()
    }, [page, search, total])


    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const setSession = (_page) => {

        // console.log(page, search);

        window.sessionStorage.setItem("page", _page ? _page : page)
        window.sessionStorage.setItem("search", search)
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
        history.push('/admin/post/theme/item/{0}'.format(d.id))
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

            let url = `/api/v1/admin/post/com/pick/list?limit=${limit}&offset=${offset}`


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
            setThemeTotal(res['total'])
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

        setSelected(newSelected);
    };

    const isSelected = (name) => {

        return selected.indexOf(name) !== -1;
    }

    const openAlert = (text) => {
        setText(text)
        setOpen({ 0: false, 1: false, 2: true })
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false })
        }, 700);
    }

    const delete_post = (selected) => {
        return new Promise(async (result, err) => {

            // console.log(selected)

            let url = '/api/v1/admin/post/com/pick/delete'
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
            setOpen(false)
            // openAlert("정상 처리 되었습니다")

            setTimeout(function () {
                window.location.reload()
            }, 700)
        })
    }

    return (
        <>
            <DialogAlert open={open} handleClose={() => setOpen(false)} text={"삭제 하시겠습니까?"}
                fn={() => delete_post(selected)} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={10}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => { }}>
                            영상테마 관리
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

                                if (themeTotal >= 8) {
                                    alert("8개만 등록 가능합니다.")
                                    return;
                                }

                                setSession()
                                history.push('/admin/post/theme/item')
                            }}
                        >추가</Button>
                    </Grid>
                    {/*<Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (selected.length > 0) {
                                    setOpen(true);
                                }
                            }}
                        >삭제</Button>
                    </Grid>*/}
                </Grid>
            </Paper>

            <Grid className={classes.tableWrap}>


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
                                    {/*<TableCell className={classes.tableCell} align="center">글번호</TableCell>*/}
                                    <TableCell className={classes.tableCell}
                                        width={"20%"}
                                        align="center">등록일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">썸네일</TableCell>
                                    <TableCell className={classes.tableCell} align="center"
                                        width={"30%"}
                                    >영상테마 제목</TableCell>
                                    <TableCell className={classes.tableCell} align="center"
                                    >리스트 수</TableCell>
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
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={() => moreBtnHandler(row)}>
                                            {row.create_at}
                                        </TableCell>
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={() => moreBtnHandler(row)}>
                                            <img src={process.env.REACT_APP_API_URL + row.thumbnail} height="120px" width="160px" />
                                        </TableCell>
                                        <TableCell className={classes.tableCell} align="left"
                                            onClick={() => moreBtnHandler(row)}>{row.title}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                            onClick={() => moreBtnHandler(row)}>{`${row.list_cnt} / 5`}</TableCell>

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