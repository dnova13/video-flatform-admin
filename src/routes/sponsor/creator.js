import clsx from 'clsx';
import React, {useEffect} from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {httpRequest} from "../../utils/httpReq";
import DialogAlert, {AlertText} from "../../utils/dialogAlert";
import Link from "@material-ui/core/Link";
import func from "../../utils/functions";

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

    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const dataReq = (q) => {
        return new Promise(async (r, e) => {

            // console.log("match", match)

            if(!match.params.id){
                return
            }

            let url = '/api/v1/admin/points/manage/sponsor/creator/read?id={0}'.format(match.params.id)
            const headers = {
                'token': window.localStorage.getItem('token')
            }

            // console.log(url);

            const res = await httpRequest('GET', url, headers, null)

            // console.log(res)

            if (!res['success'] || res['code'] !== 1000) {

                if (res['code'] !== 1001) {

                    if (res['code'] === 1008) {
                        func.removeToken()
                    }

                    alert('불러오기 실패')
                    return
                }
            }

            //  console.log(res)

            setState(res['data'])
        })
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} onClick={() => {
                                        // console.log(state)
                        }}>
                            후원 정보
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
                                history.push('/admin/earnings/sponsor/list')
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
                value="후원 내역"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{width: '100%'}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="후원일"
                            name="date"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['sponsor_at'] ? state['sponsor_at'] : ''}
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="유형"
                            name="type"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value="크리에이터 후원"
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
                            label="후원 포인트"
                            name="sponsor_point"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['point_quantity'] ? numberWithCommas(state['point_quantity']) + " P": ''}
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
                            label="크리에이터 닉네임"
                            name="creator"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['receiver_nickname'] ? state['receiver_nickname'] : ''}
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
                </Grid>
                <hr/>
            </Paper>
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{width: '100%'}}>
                <Typography variant="body2" color="black" fontWeight="bold" align="center">
                    {/* TODO : 회원 관리에서 한 회원의 후원한거 링크*/}
                    <Link color="inherit" href={"/admin/member/user/sponsoring/"+state.user_id}>+ 회원 포인트 후원 내역 전체 보기</Link>
                </Typography>
            </Paper>
            </>
    )
}