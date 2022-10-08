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
        history,
        match
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

    const [open, setOpen] = React.useState({0: false, 1: false})
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
        history.push('/admin/post/postList/item/{0}'.format(d.video_post_id))
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

            let url = `/api/v1/admin/user/manage/member/detail/reply/list?user_id=${match.params.id}&limit=${limit}&offset=${offset}`
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
        setOpen({0: false, 1: false})
        setTimeout(function () {
            setOpen({0: false, 1: false})
        }, 700);
    }

    const handleSelChange = (event) => {

        // console.log(event.target.value)

        setType(event.target.value);
        setPage(1)
        setSession(1, event.target.value)
    };

    const chkBlind = (selected, _type) => {
        return new Promise(async (result, err) => {

            // console.log(selected)

            let url = _type > 0 ? "/api/v1/admin/report/chk/blind/reply" : "/api/v1/admin/report/unchk/blind/reply"
            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            let res;

            for (let item of selected) {

                let data = {
                    id: item,
                    where: "video"
                }

                // console.log(data);
                res = await httpRequest('POST', url, headers, JSON.stringify(data))

                if (res['code'] > 1000) {
                    alert('실패')
                    return
                }
            }

            // console.log(res)
            setOpen({0: false, 1: false})
            // openAlert("정상 처리 되었습니다")

            setTimeout(function () {
                window.location.reload()
            }, 700)
        })
    }


    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({...open, 0: false})} text={"블라인드 하시겠습니까?"}
                         fn={() => chkBlind(selected, 1)}/>
            <DialogAlert open={open[1]} handleClose={() => setOpen({...open, 1: false})} text={"블라인드 해제 하시겠습니까?"}
                         fn={() => chkBlind(selected, 0)}/>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} onClick={() => {}}>
                            작성 댓글
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
                                    setOpen({...open, 0: true})
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
                                    setOpen({...open, 1: true})
                                }
                            }}
                        >블라인드 해제</Button>
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
                                            inputProps={{"aria-label": "select all post"}}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tableCell} align="center">등록일</TableCell>
                                    <TableCell className={classes.tableCell} align="center">작성자</TableCell>
                                    <TableCell className={classes.tableCell} align="center"
                                               style={{paddingLeft: '40px'}}
                                    >게시물</TableCell>
                                    <TableCell className={classes.tableCell} align="center">댓글 내용</TableCell>
                                    <TableCell className={classes.tableCell} align="center">블라인드 유무</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state[0] ? state.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell padding="checkbox">
                                            <YellowCheckbox
                                                inputProps={{"aria-labelledby": `enhanced-table-checkbox-${index}`}}
                                                onClick={(e) => handleClick(e, row.id)}
                                                checked={isSelected(row.id)}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableCell}
                                                   align="center"
                                                   onClick={() => moreBtnHandler(row)}
                                        >{row.create_at}</TableCell>
                                        <TableCell className={classes.tableCell} align="center"
                                                   onClick={() => moreBtnHandler(row)}
                                        >{row.nickname}</TableCell>

                                        <TableCell className={classes.tableCell}
                                                   align="left"
                                                   style={
                                                       {
                                                           paddingTop: '10px',
                                                           paddingBottom: '10px'
                                                       }}
                                                   onClick={() => moreBtnHandler(row)}
                                        >
                                            <TableCell
                                                style={
                                                    {
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                        borderBottom: "0px"
                                                    }}
                                            >
                                                <img src={process.env.REACT_APP_API_URL + row.thumbnail}
                                                     height="100px" width="120px"/>
                                            </TableCell>
                                            <TableCell
                                                style={
                                                    {
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                        borderBottom: "0px",
                                                        width:"100%"
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
                                            </TableCell>
                                        </TableCell>
                                        <TableCell className={classes.tableCell}
                                                   align="center"
                                                   onClick={() => moreBtnHandler(row)}
                                        >
                                            <TextField
                                                InputProps={{
                                                    readOnly: true,
                                                    disableUnderline: true, classes: {input: classes.fontSize13}
                                                }}
                                                multiline
                                                rows={3}
                                                rowsMax={5}
                                                value={row.content}
                                            />
                                        </TableCell>
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
            <Grid container direction="column-reverse" alignItems="flex-end" style={{paddingTop: '20px'}}>
                <Grid item xs={12}>
                    <Pagination count={total} page={page} size="large" variant="outlined" shape="rounded"
                                color="primary"
                                onChange={(e, v) => {

                                    console.log("v", v)
                                    setPage(v)
                                    setSession(v)
                                    // history.push(`/admin/service/notice/list?p=${v}&s=${search}`)
                                }}/>
                </Grid>
            </Grid>
        </>
    )
}