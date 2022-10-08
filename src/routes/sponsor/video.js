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
import { Player, ControlBar } from 'video-react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import func from "../../utils/functions";
import HLSSource from '../../components/HLSSource';


export default (props) => {
    const { classes, history, match } = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    const [state, setState] = React.useState('');

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

            //  // console.log("match", match)

            if (!match.params.id) {
                return
            }

            let url = '/api/v1/admin/points/manage/sponsor/video/read?id={0}'.format(match.params.id)
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

            let item = res['data'];
            item.total_sponsor_points = numberWithCommas(item.total_sponsor_points)

            setState(item)
        })
    }

    const numberWithCommas = (x) => {

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => {
                                // // console.log(state)
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
                            style={{ fontWeight: 'bold', color: '#041E62', backgroundColor: '#E0E7F7' }}
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
                style={{ marginLeft: '10px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: { input: classes.fontSize22 }
                }}
                value="후원 내역"
            />
            {state ?
                <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="후원일"
                                name="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={state['sponsor_at'] ? state['sponsor_at'] : ''}
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
                                label="유형"
                                name="type"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value="크리에이터 후원"
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
                                label="후원 포인트"
                                name="sponsor_point"
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
                        <Grid item xs={12} sm={12}>
                            <label
                                style={{
                                    color: 'rgba(0, 0, 0, 0.54)',
                                    padding: '0',
                                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                    fontWeight: '400',
                                    lineHeight: '1',
                                    letterSpacing: '0.00938em',

                                }}
                            >후원한 영상</label>
                        </Grid>
                        <Grid item xs={12} sm={5}
                            style={{
                                marginTop: "0px",
                            }}>
                            <Grid container justify="center" alignItems="center" >
                                <Player poster={process.env.REACT_APP_API_URL + state.thumbnail}
                                    fluid={false} width="100%" height={250} controls
                                >
                                    <HLSSource
                                        isVideoChild
                                        src={process.env.REACT_APP_VIDEO_URL + state.video}
                                    />
                                </Player>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <TableContainer>
                                <Table className={classes.table} style={{ marginTop: "15px" }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left"
                                                style={{
                                                    fontSize: "18px",
                                                    textDecorationLine: "underline"
                                                }}
                                            >
                                                {state.title}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left"
                                                style={{
                                                    fontSize: "20px",
                                                    paddingBottom: "25px"
                                                }}
                                            >
                                                {state.receiver_nickname}
                                            </TableCell>
                                        </TableRow >
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left">
                                                등록일 : {state.video_create_at}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left">
                                                조회수 : {state.view_cnt} &nbsp;
                                                평점 : {state.score} &nbsp;
                                                박수 : {state.like_cnt} &nbsp;
                                                찜 : {state.dibs_cnt} &nbsp;
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left">
                                                후원수 : {state.number_of_sponsor} &nbsp;
                                                후원 금액 : {state.total_sponsor_points}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <hr />
                </Paper> : ""
            }
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Typography variant="body2" color="#041E62" fontWeight="bold" align="center">
                    <Link color="inherit" href={"/admin/member/user/sponsoring/" + state.user_id}>+ 회원 포인트 후원 내역 전체
                        보기</Link>
                </Typography>
            </Paper>
        </>
    )
}