import clsx from 'clsx';
import React, { useEffect } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { httpRequest } from "../../utils/httpReq";
import DialogAlert, { AlertText } from "../../utils/dialogAlert";
import func from "../../utils/functions";

export default (props) => {
    const { classes, history, match } = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    const [state, setState] = React.useState({});

    useEffect(() => {
        dataReq()
    }, [])

    const div = {
        1: "남자",
        2: "여자"
    }

    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false })
    const [text, setText] = React.useState('')

    const openAlert = (text) => {

        setText(text)
        setOpen({ 0: false, 1: false, 2: true })
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false })
        }, 700);
    }

    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const dataReq = (q) => {
        return new Promise(async (r, e) => {

            if (!match.params.id) {
                return
            }

            let url = '/api/v1/admin/service/notice/read?id={0}'.format(match.params.id)
            const headers = {
                'token': window.localStorage.getItem('token')
            }

            const res = await httpRequest('GET', url, headers, null)

            if (!res['success'] || res['code'] !== 1000) {

                if (res['code'] !== 1001) {

                    if (res['code'] === 1008) {
                        func.removeToken()
                    }

                    // removeToken()
                    alert('불러오기 실패')
                    return
                }
                /*if (res['code'] === 2002) {
                    removeToken()
                }*/
            }

            // console.log(res)

            setState(res['data'])
        })
    }


    const save_notice = () => {
        setOpen({ 0: false, 1: false, 2: false })
        return new Promise(async (r, e) => {

            let url = '/api/v1/admin/service/notice/write'
            let data = { title: state['title'], content: state['content'] }

            if (match.params.id) {
                url = '/api/v1/admin/service/notice/modify'
                data = { id: match.params.id, title: state['title'], content: state['content'] }
            }

            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            // console.log(data)

            const res = await httpRequest('POST', url, headers, JSON.stringify(data))

            if (!res['success'] || res['code'] !== 1000) {
                alert('실패')
                return
            }

            openAlert("정상 처리 되었습니다")

            setTimeout(function () {
                history.push('/admin/service/notice/list')
            }, 700)
        })
    }

    const delete_notice = () => {
        setOpen({ 0: false, 1: false, 2: false })
        return new Promise(async (r, e) => {

            let url = '/api/v1/admin/service/notice/delete'
            let data = { id: match.params.id }

            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            const res = await httpRequest('POST', url, headers, JSON.stringify(data))

            if (!res['success'] || res['code'] !== 1000) {
                alert('실패')
                return
            }

            openAlert("정상 처리 되었습니다")

            setTimeout(function () {
                history.push('/admin/service/notice/list')
            }, 700)
        })
    }

    const changeValue = (e) => {

        let val = { ...state }

        val[e.target.name] = e.target.value

        // console.log(val);

        setState(val)
    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={"저장 하시겠습니까?"}
                fn={() => save_notice()} />
            <DialogAlert open={open[1]} handleClose={() => setOpen({ ...open, 1: false })} text={"삭제 하시겠습니까?"}
                fn={() => delete_notice()} />
            <AlertText open={open[2]} handleClose={() => setOpen({ ...open, 2: false })} text={text} classes={classes} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => {
                                // console.log(state)
                            }}>
                            공지사항
                        </Typography>
                    </Grid>
                    {match.params.id ?
                        <Grid item xs={12} sm={2}>
                            <Button
                                className={classes.textColorWhite}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={
                                    {
                                        backgroundColor: '#FFAE64',
                                        color: 'black'
                                    }
                                }
                                onClick={() => {
                                    setOpen({ ...open, 0: true })
                                }}
                            >수정</Button>
                        </Grid> : <Grid item xs={12} sm={2}> </Grid>
                    }
                    {match.params.id ?
                        <Grid item xs={12} sm={2}>
                            {/*<Button
                                className={classes.textColorWhite}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                // style={{backgroundColor: '#787878'}}
                                onClick={() => {
                                    setOpen({...open, 1: true})
                                }}
                            >삭제</Button>*/}
                        </Grid> :
                        <Grid item xs={12} sm={2}>
                            <Button
                                className={classes.textColorWhite}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                style={
                                    {
                                        backgroundColor: '#FFAE64',
                                        color: 'black'
                                    }
                                }
                                onClick={() => {
                                    setOpen({ ...open, 0: true })
                                }}
                            >등록</Button>
                        </Grid>
                    }

                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{ fontWeight: 'bold', color: '#041E62', backgroundColor: '#E0E7F7' }}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.push('/admin/service/notice/list')
                            }}
                        >뒤로가기</Button>
                    </Grid>
                </Grid>
            </Paper>
            <TextField
                className={classes.marginTop20}
                style={{ marginLeft: '10px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: { input: classes.fontSize22 }
                }}
                value="제목"
            />
            <Paper className={clsx(classes.paper, classes.marginTop30)} style={{ width: '100%' }}>
                <Grid container>
                    <Grid item xs={2}> </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="제목"
                            name="title"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                maxlength: 100
                            }}
                            helperText={state['title'] ? `${state['title'].length}/${100}` : `0/100`}
                            fullWidth
                            value={state['title'] ? state['title'] : ''}
                            InputProps={{
                                classes: { input: classes.paddingLT }
                            }}
                            onChange={(e) => {
                                changeValue(e)
                            }}
                        />

                    </Grid>
                    <Grid item xs={2}> </Grid>
                </Grid>
            </Paper>
            <TextField
                className={classes.marginTop20}
                style={{ marginLeft: '10px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: { input: classes.fontSize22 }
                }}
                value="내용"
            />
            <Paper className={clsx(classes.paper, classes.marginTop30)} style={{ width: '100%' }}>
                <Grid container>
                    <Grid item xs={2}> </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="내용"
                            name="content"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                maxlength: 2730
                            }}
                            helperText={state['content'] ? `${state['content'].length}/${2730}` : `0/2730`}
                            fullWidth
                            value={state['content'] ? state['content'] : ''}
                            multiline
                            rows={20}
                            rowsMax={40}
                            InputProps={{
                                classes: { input: classes.paddingLT }
                            }}
                            onChange={(e) => {
                                changeValue(e)
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}> </Grid>
                </Grid>
            </Paper>
        </>
    )
}