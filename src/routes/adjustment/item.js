import clsx from 'clsx';
import React, {useEffect} from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {httpRequest} from "../../utils/httpReq";
import DialogAlert, {AlertText} from "../../utils/dialogAlert";
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

            if(!match.params.id){
                return
            }

            let url = '/api/v1/admin/points/manage/adjustment/read?id={0}'.format(match.params.id)
            const headers = {
                'token': window.localStorage.getItem('token')
            }

            const res = await httpRequest('GET', url, headers, null)

            if (!res['success'] || res['code'] !== 1000) {

                if (res['code'] !== 1001) {
                    // removeToken()

                    if (res['code'] === 1008) {
                        func.removeToken()
                    }

                    alert('불러오기 실패')
                    return
                }
            }

            // console.log(res)

            setState(res['data'])
        })
    }


    const changeValue = (e) => {

        let val = {...state}

        // console.log(val);

        // console.log(e.target.value)

        val[e.target.name] = e.target.value
        setState(val)
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const completeAdjustment = async (ajId, pointType, uid) => {

        // console.log(ajId, pointType, uid);

        let url = `/api/v1/admin/points/manage/adjustment/complete`
        let data = {
            "id": ajId,
            "user_id" : uid,
            "point_type": pointType
        }

        const headers = {
            'token': window.localStorage.getItem('token'),
            'Content-type': 'application/json; charset=utf-8'
        }

        let res = await httpRequest('POST', url, headers, JSON.stringify(data))

        if (res['code'] > 1000) {
            alert('실패')
            return
        }

        setOpen({...open, 0: false})
        openAlert("정상 처리 되었습니다")
        // console.log(res)

        setTimeout(function () {
            window.location.reload()
        }, 700)
    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({...open, 0: false})} text={"정산 하시겠습니까?"}
                         fn={() => completeAdjustment(state.id, state.point_type, state.user_id)}/>
            <AlertText open={open[2]} handleClose={() => setOpen({...open, 2: false})} text={text} classes={classes}/>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                                    style={{paddingTop: '5px', margin: 0}} onClick={() => {
                                        // console.log(state)
                        }}>
                            정산 신청 내역
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        {state.status === 0 ?
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                style={
                                    {
                                        backgroundColor: '#FFAE64',
                                        color: '#041E62',
                                        fontWeight: 'bold',
                                    }
                                }
                                onClick={() => {
                                    // console.log("!!!!")
                                    setOpen({...open, 0: true})
                                }}
                            >정산 완료</Button> :
                            <Button
                                fullWidth
                                variant="contained"
                                color="default"
                                style={
                                    {
                                        backgroundColor: '#DDDDDD',
                                        color: '#A6A6A6',
                                        fontWeight: 'bold',
                                        cursor: 'default'
                                    }
                                }
                            >정산 완료</Button>
                        }
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{fontWeight: 'bold', color: '#041E62', backgroundColor:'#E0E7F7'}}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.push('/admin/earnings/adjustment/list')
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
                value="신청 내역"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{width: '100%'}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="신청일"
                            name="date"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['apply_at'] ? state['apply_at'] : ''}
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
                            label="처리현황"
                            name="progress"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state.status === 1 ? "정산 완료" : "정산 신청"}
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
                            label="정산 포인트"
                            name="points"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={ state['point_quantity'] ? numberWithCommas(state['point_quantity']) + "P" : ''}
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
                            label="정산 금액"
                            name="price"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['point_quantity'] ? numberWithCommas(state['point_quantity']) : ''}
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
                    </Grid><Grid item xs={12} sm={6}>
                    <TextField
                        label="예금주명"
                        name="accountHolder"
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        value={state['account'] ? state['account'].split("+")[2]: ''}
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
                    </Grid><Grid item xs={12} sm={6}>
                    <TextField
                        label="은행명"
                        name="bank"
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        value={state['account'] ? state['account'].split("+")[0]: ''}
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
                            label="계좌 번호"
                            name="accountNum"
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            value={state['account'] ? state['account'].split("+")[1]: ''}
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
            </Paper>
        </>
    )
}