import clsx from 'clsx';
import React, { useEffect } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { httpRequest } from "../../utils/httpReq";
import DialogAlert, { AlertText } from "../../utils/dialogAlert";
import Link from "@material-ui/core/Link";
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

            let url = '/api/v1/admin/points/manage/charge/read?id={0}'.format(match.params.id)
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

            //console.log(res)

            setState(res['data'])
        })
    }

    const changeValue = (e) => {

        let val = { ...state }

        // console.log(val);

        // console.log(e.target.value)

        val[e.target.name] = e.target.value
        setState(val)
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
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => {
                                // console.log(state)
                            }}>
                            포인트 충전 정보
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{ fontWeight: 'bold', color: '#041E62', backgroundColor: '#E0E7F7' }}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.push('/admin/earnings/charge/list')
                            }}
                        >뒤로가기</Button>
                    </Grid>
                </Grid>
            </Paper>
            <TextField
                className={classes.marginTop30}
                style={{ marginLeft: '10px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: { input: classes.fontSize22 }
                }}
                value="포인트"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="충전일"
                            name="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={state['charge_at'] ? state['charge_at'] : ''}
                            InputProps={{
                                readOnly: true,
                                classes: { input: classes.paddingLT }
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="회원 닉네임"
                            name="nickname"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={state['nickname'] ? state['nickname'] : ''}
                            InputProps={{
                                readOnly: true,
                                classes: { input: classes.paddingLT }
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="충전 포인트"
                            name="point"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={state['point_quantity'] ? numberWithCommas(state['point_quantity']) + " P" : ''}
                            InputProps={{
                                readOnly: true,
                                classes: { input: classes.paddingLT }
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="결제 금액"
                            name="price"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={state['payment_price'] ? numberWithCommas(state['payment_price']) : ''}
                            InputProps={{
                                readOnly: true,
                                classes: { input: classes.paddingLT }
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="결제 정보"
                            name="price"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={state['payment_info'] ? state['payment_info'] : ''}
                            InputProps={{
                                readOnly: true,
                                classes: { input: classes.paddingLT }
                            }}
                            style={
                                {
                                    cursor: "default"
                                }
                            }
                        />
                    </Grid>
                </Grid>
                <hr />
            </Paper>
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Typography variant="body2" color="#041E62" fontWeight="bold" align="center">
                    {/* TODO : 회원 관리에서 한 회원의 포인트*/}
                    <Link color="inherit" href={"/admin/member/user/point/" + state.user_id}>+ 회원 포인트 충전 내역 전체 보기</Link>
                </Typography>
            </Paper>
        </>
    )
}