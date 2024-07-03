import clsx from 'clsx';
import React, { useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { httpRequest } from '../../utils/httpReq';
import DialogAlert, { AlertText } from '../../utils/dialogAlert';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HLSSource from '../../components/HLSSource';

import flIcon from '../../flatform.png';

import { deepOrange, deepPurple } from '@material-ui/core/colors';

import Link from '@material-ui/core/Link';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';

import { Player } from 'video-react';
import func from '../../utils/functions';
import userIcon from '../../user.png';
import InputAdornment from '@material-ui/core/InputAdornment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import UncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

// import 'video-react/dist/video-react.css';

export default (props) => {
    const { classes, history, match } = props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // const ava = useStyles();

    const [info, setInfo] = React.useState({});
    const [creator, setCreator] = React.useState({});
    const [video, setVideo] = React.useState();

    useEffect(() => {
        getMemberInfo();
    }, []);

    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false });
    const [text, setText] = React.useState('');

    const openAlert = (text) => {
        setText(text);
        setOpen({ 0: false, 1: false, 2: true });
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false });
        }, 700);
    };

    const getMemberInfo = (q) => {
        return new Promise(async (r, e) => {
            // console.log("match", match)

            if (!match.params.id) {
                return;
            }

            let urlArr = [];

            urlArr[0] = `/api/v1/admin/user/manage/member/detail/user?user_id=${match.params.id}`;
            urlArr[1] = `/api/v1/admin/user/manage/creator/apply/detail?id=${match.params.id}`;

            const headers = {
                token: window.localStorage.getItem('token'),
            };

            let resArr = [];
            let errChk = 0;

            for (let url of urlArr) {
                let res = await httpRequest('GET', url, headers, null);

                resArr.push(res);

                if (!res['success'] || res['code'] !== 1000) {
                    if (res['code'] !== 1001) {
                        // removeToken()

                        errChk++;

                        if (res['code'] === 1008) {
                            func.removeToken();
                        }
                        // alert('불러오기 실패')
                    }
                }
            }

            // console.log(resArr);

            let item = resArr[0]['data'];
            setInfo(item);

            // console.log("creator ", resArr)

            if (resArr[1]['success']) {
                let item = resArr[1]['data'];

                // console.log(item)

                let arr = item.account.split('+');

                if (arr.length === 2) {
                    item.bank = arr[0];
                    item.account_num = arr[1];
                }

                setCreator(item);
                setVideo(item.videos);
            }
        });
    };

    const numberWithCommas = (x) => {
        if (!x) return 0;

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const chkAuth = (selected, _type) => {
        return new Promise(async (result, err) => {
            // console.log(selected)
            setOpen({ 0: false, 1: false });

            let url = _type > 0 ? '/api/v1/admin/user/manage/creator/apply/approve' : '/api/v1/admin/user/manage/creator/apply/reject';
            const headers = {
                token: window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8',
            };

            let res;
            let data = {
                id: selected,
            };

            res = await httpRequest('POST', url, headers, JSON.stringify(data));
            // console.log(res)

            if (res['code'] > 1000) {
                alert('실패');
                return;
            }

            openAlert('정상 처리 되었습니다');

            setTimeout(function () {
                window.location.reload();
            }, 700);
        });
    };

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k);
        }
    };

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={'승인 하시겠습니까?'} fn={() => chkAuth(match.params.id, 1)} />
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
                                // console.log(info)
                            }}
                        >
                            회원 정보
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}></Grid>
                    <Grid item xs={12} sm={2}>
                        {creator['status'] === 0 ? (
                            creator['copyright'] > 0 ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    style={{ backgroundColor: '#FFAE64' }}
                                    onClick={() => {
                                        setOpen({ ...open, 0: true });
                                    }}
                                >
                                    승인
                                </Button>
                            ) : (
                                <Button fullWidth variant="contained" color="secondary" disabled style={{ backgroundColor: '#BDBDBD' }}>
                                    승인
                                </Button>
                            )
                        ) : (
                            ''
                        )}
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            style={{ fontWeight: 'bold', color: '#041E62', backgroundColor: '#E0E7F7' }}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                history.push('/admin/member/apply/list');
                            }}
                        >
                            뒤로가기
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* 회원 프로필 */}
            <TextField
                className={classes.marginTop30}
                style={{ marginLeft: '10px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                    classes: { input: classes.fontSize22 },
                }}
                value="회원 프로필"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={12}
                        sm={7}
                        style={{
                            padding: '20px',
                        }}
                    >
                        <TableRow>
                            <TableCell className={classes.tableCellNotBorder}>
                                <Avatar
                                    src={info.icon ? process.env.REACT_APP_API_URL + info.icon : ''}
                                    style={{
                                        color: 'white',
                                        width: '70px',
                                        height: '70px',
                                        // backgroundColor: deepOrange[500],
                                        align: 'right',
                                    }}
                                >
                                    {info.nickname ? info.nickname.slice(0, 1) : ''}
                                </Avatar>
                            </TableCell>
                            <TableCell className={classes.tableCellNotBorder}>
                                <h3>{info.nickname}</h3>
                                {info.is_creator ? <img width={'20px'} height={'20px'} src={flIcon} /> : ''}
                            </TableCell>
                        </TableRow>
                    </Grid>
                    <Grid item xs={12} sm={5}></Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="회원 유형"
                            name="type"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['is_creator'] > 0 ? '크리에이터' : '일반'}
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
                            label="가입일"
                            name="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info.create_at}
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
                            label="회원 닉네임"
                            name="nickname"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info.nickname}
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
                            label="이름"
                            name="name"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['name'] ? info['name'] : ''}
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
                            label="휴대폰 번호"
                            name="ph"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['phone'] ? info['phone'] : ''}
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
                            label="이메일"
                            name="email"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['email'] ? info['email'] : ''}
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="birth"
                            label="생년월일"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['birth'] ? info['birth'] : ''}
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="성별"
                            name="gender"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['gender'] ? (info['gender'] === 1 ? '남' : '여') : ''}
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
                            label="주소"
                            name="address"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={info['address'] ? info['address'].replace('+', ') ').replaceAll('+', ' ') : ''}
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

            {/*크레이터 정보*/}

            <TextField
                className={classes.marginTop30}
                style={{ marginLeft: '10px', marginTop: '50px' }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                    classes: { input: classes.fontSize22 },
                }}
                value="크리에이터 신청 정보"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            label="이름"
                            name="name"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator['name'] ? creator['name'] : ''}
                            InputProps={{
                                readOnly: true,
                                classes: { input: classes.paddingLT },
                            }}
                            style={{
                                cursor: 'default',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={7}></Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="한줄 소개"
                            name="intro"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator['intro'] ? creator['intro'] : ''}
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
                            label="sns 주소"
                            name="sns"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator.sns}
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
                            label="주요 활동 지역"
                            name="activity_region"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator.activity_region}
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
                            label="은행명"
                            name="bank"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator['bank'] ? creator['bank'] : ''}
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
                            label="계좌번호"
                            name="account"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator['account_num'] ? creator['account_num'] : ''}
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
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="주요 작품 소개"
                            name="piece"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            multiline={true}
                            value={creator['piece'] ? creator['piece'] : ''}
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
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="동영상 저작권 동의 여부"
                            name="copyright"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={creator['copyright'] ? '동의' : '비동의'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        {creator['copyright'] ? <CheckCircleIcon style={{ color: '#606060' }} /> : <UncheckedIcon style={{ color: '#606060' }} />}
                                    </InputAdornment>
                                ),
                                readOnly: true,
                                classes: { input: classes.paddingLT },
                            }}
                            style={{
                                cursor: 'default',
                                fontWeight: 'bold',
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
                            활동 사진
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {creator.images ? (
                            <TableRow>
                                <TableCell width={'33.3%'} className={classes.tableCellNotBorder} align="left">
                                    {creator.images[0] ? <img width={'100%'} height={'250px'} src={process.env.REACT_APP_API_URL + creator.images[0]} /> : ''}
                                </TableCell>
                                <TableCell width={'33.3%'} className={classes.tableCellNotBorder} align="left">
                                    {creator.images[1] ? <img width={'100%'} height={'250px'} src={process.env.REACT_APP_API_URL + creator.images[1]} /> : ''}
                                </TableCell>
                                <TableCell width={'33.3%'} className={classes.tableCellNotBorder} align="left">
                                    {creator.images[2] ? <img width={'100%'} height={'250px'} src={process.env.REACT_APP_API_URL + creator.images[2]} /> : ''}
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow></TableRow>
                        )}
                    </Grid>
                </Grid>
                <hr />
            </Paper>

            {/*올린 영상*/}
            {video ? (
                <TextField
                    className={classes.marginTop30}
                    style={{ marginLeft: '10px', marginTop: '50px' }}
                    InputProps={{
                        readOnly: true,
                        disableUnderline: true,
                        classes: { input: classes.fontSize22 },
                    }}
                    value="업로드 영상"
                />
            ) : (
                ''
            )}
            {video ? (
                <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                    {video.map((row, idx) => (
                        <Paper key={idx} className={clsx(classes.paper, classes.marginTop20)} style={{ width: '100%' }}>
                            <Grid container spacing={3}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
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
                                            fluid={false}
                                            width="100%"
                                            height={320}
                                            controls
                                        >
                                            <HLSSource isVideoChild inactive={true} src={process.env.REACT_APP_VIDEO_URL + row.video} />
                                        </Player>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Grid>
                                        <TextField
                                            label={'제목'}
                                            style={{ marginLeft: '10px', marginTop: '10px', fontWeight: 'bold' }}
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                                classes: { input: classes.fontSize22 },
                                            }}
                                            value={row.title}
                                        />
                                    </Grid>
                                    <Grid style={{ marginRight: '10px' }}>
                                        <TextField
                                            label={'내용'}
                                            className={classes.marginTop30}
                                            style={{ marginLeft: '10px', marginTop: '40px' }}
                                            multiline
                                            fullWidth={true}
                                            rows={7}
                                            rowsMax={10}
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                                classes: { input: classes.fontSize22 },
                                            }}
                                            value={row.content}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Paper>
            ) : (
                ''
            )}
        </>
    );
};
