import clsx from 'clsx';
import React, { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { httpRequest } from '../../utils/httpReq';
import DialogAlert, { AlertText } from '../../utils/dialogAlert';
import Link from '@material-ui/core/Link';
import { Player, ControlBar } from 'video-react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import func from '../../utils/functions';
import HLSSource from '../../components/HLSSource';

export default (props) => {
    const { classes, history, match } = props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    useEffect(() => {
        dataReq();
    }, []);

    const div = {
        1: '남자',
        2: '여자',
    };

    const [state, setState] = React.useState('');
    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false });
    const [text, setText] = React.useState('');

    const openAlert = (text) => {
        setText(text);
        setOpen({ 0: false, 1: false, 2: true });
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false });
        }, 700);
    };

    const removeToken = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('isLogin');
        window.location.replace('/admin');
    };

    const dataReq = (q) => {
        return new Promise(async (r, e) => {
            // console.log("match", match)

            if (!match.params.id) {
                return;
            }

            let url = '/api/v1/admin/report/read?id={0}&type={1}'.format(match.params.id, 'video');
            const headers = {
                token: window.localStorage.getItem('token'),
            };

            const res = await httpRequest('GET', url, headers, null);

            if (!res['success'] || res['code'] !== 1000) {
                if (res['code'] !== 1001) {
                    // removeToken()
                    if (res['code'] === 1008) {
                        func.removeToken();
                    }

                    alert('불러오기 실패');
                    return;
                }
            }

            let item = res['data'];
            item.total_sponsor_points = numberWithCommas(item.total_sponsor_points);

            switch (item.category) {
                case 1:
                    item.reason = '명예훼손/사생활 침해 및 저작권 침해 등';
                    break;
                case 2:
                    item.reason = '음란성 또는 청소년에게 부적합한 콘텐츠';
                    break;
                case 3:
                    item.reason = '폭력 또는 혐오스러운 콘텐츠';
                    break;
                case 4:
                    item.reason = '불법, 유해한 위험행위 등 부적절한 콘텐츠';
                    break;
                case 5:
                    item.reason = '기타';
                    break;
            }

            // console.log("#!!!!!!!!!!!!!!!!!!!",item)

            setState(item);
        });
    };

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const chkBlind = (id, _type) => {
        setOpen({ 0: false, 1: false, 2: false });
        return new Promise(async (result, err) => {
            // console.log(id)

            let url = _type > 0 ? '/api/v1/admin/report/chk/blind/video' : '/api/v1/admin/report/unchk/blind/video';
            const headers = {
                token: window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8',
            };

            let res;
            let data = {
                id: id,
            };

            // console.log(data);
            res = await httpRequest('POST', url, headers, JSON.stringify(data));

            if (res['code'] > 1000) {
                alert('실패');
                return;
            }

            // console.log(res)
            openAlert('정상 처리 되었습니다');
            setTimeout(function () {
                window.location.reload();
            }, 700);
        });
    };

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={'블라인드 하시겠습니까?'} fn={() => chkBlind(match.params.id, 1)} />
            <DialogAlert open={open[1]} handleClose={() => setOpen({ ...open, 1: false })} text={'블라인드 해제 하시겠습니까?'} fn={() => chkBlind(match.params.id, 0)} />
            <AlertText open={open[2]} handleClose={() => setOpen({ ...open, 2: false })} text={text} classes={classes} />

            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="initial"
                            gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }}
                            onClick={() => {
                                // console.log(state)
                            }}
                        >
                            신고 내역 상세
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}></Grid>
                    <Grid item xs={12} sm={2}>
                        {!state.blind_chk ? (
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                style={{
                                    backgroundColor: '#FFAE64',
                                }}
                                onClick={() => {
                                    setOpen({ ...open, 0: true });
                                }}
                            >
                                블라인드
                            </Button>
                        ) : (
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setOpen({ ...open, 1: true });
                                }}
                            >
                                블라인드 해제
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{ fontWeight: 'bold', color: '#041E62', backgroundColor: '#E0E7F7' }}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.push('/admin/report/video/list');
                            }}
                        >
                            뒤로가기
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            {state ? (
                <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="신고일"
                                name="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={state['report_at'] ? state['report_at'] : ''}
                                InputProps={{
                                    readOnly: true,
                                    classes: { input: classes.paddingLT },
                                }}
                                style={{
                                    cursor: 'default',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="신고 유형"
                                name="type"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={'영상'}
                                InputProps={{
                                    readOnly: true,
                                    classes: { input: classes.paddingLT },
                                }}
                                style={{
                                    cursor: 'default',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="사유"
                                name="reason"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={state.reason}
                                InputProps={{
                                    readOnly: true,
                                    classes: { input: classes.paddingLT },
                                }}
                                style={{
                                    cursor: 'default',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="신고한 닉네임"
                                name="reporting_nickname"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={state['reporting_nickname'] ? state['reporting_nickname'] : ''}
                                InputProps={{
                                    readOnly: true,
                                    classes: { input: classes.paddingLT },
                                }}
                                style={{
                                    cursor: 'default',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="상세 사유"
                                name="detail"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={state['content'] ? state['content'] : ''}
                                multiline
                                rows={3}
                                rowsMax={10}
                                InputProps={{
                                    readOnly: true,
                                    classes: { input: classes.paddingLT },
                                }}
                                style={{
                                    cursor: 'default',
                                }}
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
                            >
                                신고한 영상
                            </label>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={5}
                            style={{
                                marginTop: '0px',
                            }}
                        >
                            <Grid container justify="center" alignItems="center">
                                <Player
                                    ref={(player) => {
                                        if (player?.volume) {
                                            player.volume = 0.5;
                                        }
                                    }}
                                    poster={state.thumbnail ? process.env.REACT_APP_API_URL + state.thumbnail : ''}
                                    fluid={false}
                                    width="100%"
                                    height={250}
                                    controls
                                >
                                    <HLSSource isVideoChild src={state.video ? process.env.REACT_APP_VIDEO_URL + state.video : ''} />
                                </Player>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <TableContainer>
                                <Table className={classes.table} style={{ marginTop: '15px' }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                className={classes.tableCellNotBorder}
                                                align="left"
                                                style={{
                                                    fontSize: '18px',
                                                    textDecorationLine: 'underline',
                                                }}
                                            >
                                                {state.title}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                className={classes.tableCellNotBorder}
                                                align="left"
                                                style={{
                                                    fontSize: '20px',
                                                    paddingBottom: '25px',
                                                }}
                                            >
                                                {state.creator_nickname}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left">
                                                등록일 : {state.video_create_at}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left">
                                                조회수 : {state.view_cnt} &nbsp; 평점 : {state.score} &nbsp; 박수 : {state.like_cnt} &nbsp; 찜 : {state.dibs_cnt} &nbsp;
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className={classes.tableCellNotBorder} align="left">
                                                후원수 : {state.number_of_sponsor} &nbsp; 후원 금액 : {state.total_sponsor_points}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="블라인드 유무"
                                name="reporting_nickname"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={state['blind_chk'] ? '블라인드' : '공개'}
                                InputProps={{
                                    readOnly: true,
                                    classes: { input: classes.paddingLT },
                                }}
                                style={{
                                    cursor: 'default',
                                    fontWeight: 'bold',
                                }}
                            />
                        </Grid>
                    </Grid>
                    <hr />
                </Paper>
            ) : (
                ''
            )}
        </>
    );
};
