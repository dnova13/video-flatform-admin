import clsx from 'clsx';
import React, {useEffect} from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {httpRequest} from "../../utils/httpReq";
import DialogAlert, {AlertText} from "../../utils/dialogAlert";
import func from "../../utils/functions"

export default (props) => {
    const {classes, history, match} = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    const [state, setState] = React.useState({});

    useEffect(() => {
        dataReq()
    }, [])

    const div = {
        1: "남자",
        2: "여자"
    }

    const [open, setOpen] = React.useState({0: false, 1: false, 2: false})
    const [text, setText] = React.useState('')

    const openAlert = (text) => {

        setText(text)
        setOpen({0: false, 1: false, 2: true})
        setTimeout(function () {
            setOpen({0: false, 1: false, 2: false})
        }, 700);
    }

    const dataReq = (q) => {
        return new Promise(async (r, e) => {

            if(!match.params.id){
                return
            }

            let url = '/api/v1/admin/service/suggest/read?id={0}'.format(match.params.id)
            const headers = {
                'token': window.localStorage.getItem('token')
            }

            const res = await httpRequest('GET', url, headers, null)

            if (!res['success'] || res['code'] !== 1000) {

                if (res['code'] !== 1001) {

                    if (res['code'] === 1008) {
                        func.removeToken()
                    }

                    alert('불러오기 실패')
                    return
                }
            }

            console.log(res)

            setState(res['data'])
        })
    }


    const save_notice = () => {
        setOpen({0: false, 1: false, 2: false})
        return new Promise(async (r, e) => {

            let url = '/api/v1/admin/service/suggest/write'
            let data = {title: state['title'], content: state['content']}

            if(match.params.id){
                url = '/api/v1/admin/service/suggest/modify'
                data = {id: match.params.id, title: state['title'], content: state['content']}
            }

            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            console.log(data)

            const res = await httpRequest('POST', url, headers, JSON.stringify(data))

            if (!res['success'] || res['code'] !== 1000) {

                if (res['code'] === 1008) {
                    func.removeToken()
                }

                alert('실패')
                return
            }

            openAlert("정상 처리 되었습니다")

            setTimeout(function() {
                history.push('/admin/service/suggest/list')
            }, 700)
        })
    }

    const delete_notice = () => {
        setOpen({0: false, 1: false, 2: false})
        return new Promise(async (r, e) => {

            let url = '/api/v1/admin/service/suggest/delete'
            let data = {id: match.params.id}

            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }

            const res = await httpRequest('POST', url, headers, JSON.stringify(data))

            if (!res['success'] || res['code'] !== 1000) {

                if (res['code'] === 1008) {
                    func.removeToken()
                }

                alert('실패')
                return
            }

            openAlert("정상 처리 되었습니다")

            setTimeout(function() {
                history.push('/admin/service/suggest/list')
            }, 700)
        })
    }

    const changeValue = (e) => {

        let val = {...state}

        console.log(val);

        console.log(e.target.value)

        val[e.target.name] = e.target.value
        setState(val)
    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({...open, 0: false})} text={"저장 하시겠습니까?"}
                         fn={() => save_notice()}/>
            <DialogAlert open={open[1]} handleClose={() => setOpen({...open, 1: false})} text={"삭제 하시겠습니까?"}
                         fn={() => delete_notice()}/>
            <AlertText open={open[2]} handleClose={() => setOpen({...open, 2: false})} text={text} classes={classes}/>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} onClick={() => {
                                        console.log(state)
                        }}>
                            건의 내역
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{fontWeight: 'bold', color: '#041E62', backgroundColor:'#E0E7F7'}}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.push('/admin/service/suggest/list')
                            }}
                        >뒤로가기</Button>
                    </Grid>
                </Grid>
            </Paper>
            <TextField
                className={classes.marginTop30}
                style={{marginLeft: '10px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: {input: classes.fontSize22}
                }}
                value="건의 사항"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{width: '100%'}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="작성일"
                            name="date"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['create_at'] ? state['create_at'] : ''}
                            InputProps={{
                                readOnly : true,
                                classes: {input: classes.paddingLT}
                            }}
                            style={
                                {
                                    cursor:"default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="회원 닉네임"
                            name="nickname"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['nickname'] ? state['nickname'] : ''}
                            InputProps={{
                                readOnly : true,
                                classes: {input: classes.paddingLT}
                            }}
                            style={
                                {
                                    cursor:"default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="제목"
                            name="title"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['title'] ? state['title'] : ''}
                            InputProps={{
                                readOnly : true,
                                classes: {input: classes.paddingLT}
                            }}
                            style={
                                {
                                    cursor:"default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="내용"
                            name="content"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['content'] ? state['content'] : ''}
                            multiline
                            rows={10}
                            rowsMax={30}
                            style={
                                {
                                    cursor:"default"
                                }
                            }
                            InputProps={{
                                classes: {input: classes.paddingLT},
                                readonly:true
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}