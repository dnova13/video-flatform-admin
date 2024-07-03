import clsx from 'clsx';
import React, { useEffect } from 'react';

import Moment from 'moment';
import 'moment/locale/ko';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { httpRequest } from '../../utils/httpReq';
import DialogAlert, { AlertText } from '../../utils/dialogAlert';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import ReplyIcon from '@material-ui/icons/SubdirectoryArrowRight';
import flIcon from '../../flatform.png';
import iconDips from '../../dips.png';
import iconEye from '../../eye.png';
import iconLike from '../../like.png';
import iconReply from '../../reply.png';
import iconStar from '../../star.png';
import iconSpon from '../../sponCnt.png';
import iconPoint from '../../point.png';
import iconReplyWr from '../../replyWrite.png';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { deepOrange, deepPurple } from '@material-ui/core/colors';

import Link from '@material-ui/core/Link';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { Player } from 'video-react';
import func from '../../utils/functions';
import userIcon from '../../user.png';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import HLSSource from '../../components/HLSSource';

// import 'video-react/dist/video-react.css';

export default (props) => {
    const { classes, history, match } = props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    // const ava = useStyles();
    const [post, setPost] = React.useState();
    const [reply, setReply] = React.useState();
    const [offset, setOffset] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [reTotal, setReTotal] = React.useState(0);
    const [reLv0Total, setReLv0Total] = React.useState(0);
    const [reId, setReId] = React.useState(0);
    const [success, setSuccess] = React.useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getReply();
    }, [offset, success, limit]);

    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false, 3: false, 4: false });
    const [text, setText] = React.useState('');

    const openAlert = (text) => {
        setText(text);
        setOpen({ 0: false, 1: false, 2: true, 3: false, 4: false });
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false, 3: false, 4: false });
        }, 700);
    };

    const getData = (q) => {
        return new Promise(async (r, e) => {
            //  console.log("match", match)

            if (!match.params.id) {
                return;
            }

            let url = '/api/v1/admin/post/manage/read?id=' + match.params.id;

            const headers = {
                token: window.localStorage.getItem('token'),
            };

            const result = await httpRequest('GET', url, headers, null);
            //  console.log(result);

            if (!result['success']) {
                if (result['code'] !== 1001) {
                    if (result['code'] === 1008) {
                        func.removeToken();
                    }

                    // removeToken()
                    alert('불러오기 실패');
                    return;
                }
            }

            //  console.log(result)

            let _data = result['data'];

            let tagsStr = '';

            for (let tag of _data.tags ? _data.tags : []) {
                tagsStr += `#${tag}  `;
            }

            _data.tags = tagsStr;

            setPost(_data ? _data : []);
        });
    };

    const getReply = (q) => {
        return new Promise(async (res, err) => {
            //  console.log("match", match)

            if (!match.params.id) {
                return;
            }

            // let limit = 10;
            let url = `/api/v1/admin/post/manage/reply/list/all?limit=${limit}&offset=${offset}&id=${match.params.id}`;

            const headers = {
                token: window.localStorage.getItem('token'),
            };

            const result = await httpRequest('GET', url, headers, null);

            if (!result['success']) {
                if (result['code'] !== 1001) {
                    if (result['code'] === 1008) {
                        func.removeToken();
                    }

                    // removeToken()
                    alert('불러오기 실패');
                    return;
                }
            }

            setReply(result['data'] ? result['data'] : []);
            setReLv0Total(result['re_total'] ? result['re_total'] : 0);
            setReTotal(result['total'] ? result['total'] : 0);

            // console.log(result)
        });
    };

    const numberWithCommas = (x) => {
        if (!x) return 0;

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const chkBlind = (id, _type) => {
        setOpen({ 0: false, 1: false, 2: false, 3: false, 4: false });

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
                where: 'video',
            };

            // console.log(data);
            res = await httpRequest('POST', url, headers, JSON.stringify(data));

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

    const chkReplyBlind = (id, _type) => {
        setOpen({ 0: false, 1: false, 2: false, 3: false, 4: false });
        return new Promise(async (result, err) => {
            // console.log(id)

            let url = _type > 0 ? '/api/v1/admin/post/manage/chk/blind/reply' : '/api/v1/admin/post/manage/unchk/blind/reply';
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

            // console.log(res)

            if (res['code'] > 1000) {
                alert('실패');
                return;
            }

            // console.log(res)
            openAlert('정상 처리 되었습니다');
            setTimeout(function () {
                // window.location.reload()
                setSuccess(true);
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
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={'블라인드 하시겠습니까?'} fn={(e) => chkBlind(match.params.id, 1)} />
            <DialogAlert open={open[1]} handleClose={() => setOpen({ ...open, 1: false })} text={'블라인드 해제 하시겠습니까?'} fn={(e) => chkBlind(match.params.id, 0)} />
            <AlertText open={open[2]} handleClose={() => setOpen({ ...open, 2: false })} text={text} classes={classes} />
            <DialogAlert open={open[3]} handleClose={() => setOpen({ ...open, 3: false })} text={'블라인드 하시겠습니까?'} fn={(e) => chkReplyBlind(reId, 1)} />
            <DialogAlert open={open[4]} handleClose={() => setOpen({ ...open, 4: false })} text={'블라인드 해제 하시겠습니까?'} fn={(e) => chkReplyBlind(reId, 0)} />

            {post ? (
                <Grid>
                    <Paper className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography component="h2" variant="h5" color="initial" gutterBottom style={{ paddingTop: '5px', margin: 0 }} onClick={() => {}}>
                                    게시물 조회
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={1}></Grid>
                            <Grid
                                item
                                xs={12}
                                sm={3}
                                style={{
                                    textAlign: 'right',
                                }}
                            >
                                {!post.blind_chk ? (
                                    <Button
                                        width={160}
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
                                        width={160}
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
                                        // history.push('/admin/member/user/list')
                                        history.goBack();

                                        //
                                    }}
                                >
                                    뒤로가기
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper className={classes.paper} style={{ marginTop: '10px', padding: '30px' }}>
                        <Grid container justify="center" alignItems="center">
                            <Player
                                ref={(player) => {
                                    if (player?.volume) {
                                        player.volume = 0.5;
                                    }
                                }}
                                fluid={false}
                                width="100%"
                                height={400}
                                aspectRatio={'16:9'}
                                controls
                                poster={process.env.REACT_APP_API_URL + post.thumbnail}
                            >
                                <HLSSource isVideoChild src={process.env.REACT_APP_VIDEO_URL + post.video} />
                            </Player>
                        </Grid>
                    </Paper>

                    {/* 영상 정보 */}
                    <Grid
                        className={classes.tableWrap}
                        style={{
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            marginTop: '10px',
                        }}
                    >
                        {/* 영상 타이틀*/}
                        <Table>
                            <TableBody>
                                <TableRow height={'85px'}>
                                    <TableCell className={classes.tablePost}>
                                        <TextField
                                            InputProps={{
                                                readOnly: true,
                                                disableUnderline: true,
                                                classes: { input: classes.fontSize22 },
                                            }}
                                            style={{
                                                paddingRight: '30px',
                                            }}
                                            multiline
                                            fullWidth={true}
                                            rows={2}
                                            rowsMax={2}
                                            value={post.title}
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tablePost} width={'200px'}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className={classes.tableCellNotBorder} width={60} align="right">
                                                        <Avatar
                                                            src={post.icon ? process.env.REACT_APP_API_URL + post.icon : ''}
                                                            style={{
                                                                color: 'white',
                                                                width: '50px',
                                                                height: '50px',
                                                                // backgroundColor: deepOrange[500],
                                                                margin: '0px',
                                                                align: 'right',
                                                            }}
                                                        >
                                                            {post.nickname ? post.nickname.slice(0, 1) : ''}
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell className={classes.tableCellNotBorder} width={200}>
                                                        <h3 style={{ marginBottom: '5px' }}>{post.nickname}</h3>
                                                        {post.is_creator ? <img width={'20px'} height={'20px'} src={flIcon} /> : ''}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell className={classes.tablePost} width={'160px'} align={'right'}>
                                        <h4 style={{ marginRight: '20px', width: '150px' }}>{post.create_at}</h4>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {/* 누계 수 */}
                        <Table style={{ marginTop: '10px' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconEye} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>누적 조회수 · 조회한 회원수</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconStar} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>평점</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconLike} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>박수</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconReply} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>댓글</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconDips} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>찜</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconSpon} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>후원수</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewHead}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item style={{ height: '32px' }}>
                                                <img src={iconPoint} width={25} height={24} />
                                            </Grid>
                                            <Grid item>
                                                <span className={classes.postViewFont}>후원 금액</span>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>
                                            {numberWithCommas(post.view_cnt)} · {numberWithCommas(post.member_view_cnt)}
                                        </span>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>{numberWithCommas(post.score)}</span>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>{numberWithCommas(post.like_cnt)}</span>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>{numberWithCommas(post.reply_cnt)}</span>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>{numberWithCommas(post.dibs_cnt)}</span>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>{numberWithCommas(post.number_of_sponsor)}</span>
                                    </TableCell>
                                    <TableCell className={classes.tablePostViewBody}>
                                        <span className={classes.postViewSpan}>{numberWithCommas(post.total_sponsor_points)}</span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {/* 내용, 해시 태그 */} {/* 크리에이터 정보 */}
                        <Table style={{ marginTop: '10px' }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            label="내용"
                                            name="content"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            value={post['content'] ? post['content'] : ''}
                                            multiline
                                            rows={5}
                                            rowsMax={5}
                                            disabled={true}
                                            style={{
                                                cursor: 'default',
                                            }}
                                            InputProps={{
                                                classes: {
                                                    input: classes.paddingLTMultilineBlack,
                                                },
                                                disableUnderline: true,
                                            }}
                                        />
                                        <TextField
                                            label="태그"
                                            name="tag"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            value={post['tags']}
                                            multiline
                                            rows={1}
                                            rowsMax={1}
                                            disabled={true}
                                            style={{
                                                cursor: 'default',
                                            }}
                                            InputProps={{
                                                classes: { input: classes.paddingLTTags },
                                                disableUnderline: true,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            label="크리에이터 정보"
                                            name="info"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            value={post['my_info'] ? post['my_info'] : ''}
                                            multiline
                                            rows={5}
                                            disabled={true}
                                            rowsMax={5}
                                            style={{
                                                cursor: 'default',
                                            }}
                                            InputProps={{
                                                classes: { input: classes.paddingLTMultilineBlack },
                                                disableUnderline: true,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            label="동영상 저작권 동의 여부"
                                            name="copyright"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            value={post['copyright'] ? '동의' : ''}
                                            disabled={true}
                                            style={{
                                                cursor: 'default',
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="end">
                                                        <CheckCircleIcon style={{ color: '#606060' }} />
                                                    </InputAdornment>
                                                ),
                                                classes: { input: classes.paddingLTMultilineBlack },
                                                disableUnderline: true,
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>

                    {/* 댓글 보기 */}
                    <Grid
                        className={classes.tableWrap}
                        style={{
                            marginTop: '10px',
                        }}
                    >
                        {/* 댓글 헤드*/}
                        <Table>
                            <TableBody>
                                <TableRow height={'85px'}>
                                    <TableCell className={classes.tablePost} style={{ paddingLeft: '30px' }}>
                                        <Grid container spacing={1} alignItems="flex-end">
                                            <Grid item>
                                                <img src={iconReplyWr} width={32} height={32} />
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    component="h2"
                                                    variant="h5"
                                                    color="initial"
                                                    gutterBottom
                                                    style={{
                                                        paddingTop: '2px',
                                                        margin: 0,
                                                        paddingBottom: '4px',
                                                    }}
                                                >
                                                    댓글 {numberWithCommas(reTotal)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* 댓글 */}
                        {reply
                            ? reply.map((row, idx) => (
                                  <Table key={row.id} style={{ marginTop: '10px' }}>
                                      <TableBody>
                                          <TableRow key={row.id}>
                                              <TableCell width={72}>
                                                  <Avatar
                                                      src={post.icon ? process.env.REACT_APP_API_URL + row.icon : ''}
                                                      style={{
                                                          color: 'white',
                                                          width: '40px',
                                                          height: '40px',
                                                          // backgroundColor: deepOrange[500],
                                                          margin: '0px',
                                                          align: 'right',
                                                      }}
                                                  >
                                                      {row.nickname ? row.nickname.slice(0, 1) : ''}
                                                  </Avatar>
                                              </TableCell>
                                              <TableCell
                                                  style={{
                                                      width: '10%',
                                                  }}
                                              >
                                                  <p style={{ fontWeight: 'bold' }}>{row.nickname}</p>
                                                  <p>{Moment(row.create_at).fromNow()}</p>
                                              </TableCell>
                                              <TableCell colSpan={2}>
                                                  <TextField
                                                      name="content"
                                                      InputLabelProps={{ shrink: true }}
                                                      fullWidth
                                                      value={row['content'] ? row['content'] : ''}
                                                      multiline
                                                      rows={3}
                                                      rowsMax={3}
                                                      disabled={true}
                                                      style={{
                                                          cursor: 'default',
                                                      }}
                                                      InputProps={{
                                                          classes: {
                                                              input: classes.paddingLTMultilineBlack,
                                                          },
                                                          disableUnderline: true,
                                                      }}
                                                  />
                                              </TableCell>
                                              <TableCell style={{ width: '20%' }}>
                                                  {!row.blind_chk ? (
                                                      <Button
                                                          width={160}
                                                          variant="contained"
                                                          color="secondary"
                                                          style={{
                                                              backgroundColor: '#FFAE64',
                                                          }}
                                                          onClick={() => {
                                                              setReId(row.id);
                                                              setOpen({ ...open, 3: true });
                                                          }}
                                                      >
                                                          블라인드
                                                      </Button>
                                                  ) : (
                                                      <Button
                                                          width={160}
                                                          variant="contained"
                                                          color="primary"
                                                          onClick={() => {
                                                              setReId(row.id);
                                                              setOpen({ ...open, 4: true });
                                                          }}
                                                      >
                                                          블라인드 해제
                                                      </Button>
                                                  )}
                                              </TableCell>
                                              {/*<TableCell></TableCell>*/}
                                          </TableRow>

                                          {/* 대댓글*/}
                                          {row.re
                                              ? row.re.map((re, idx) => (
                                                    <TableRow key={re.id}>
                                                        <TableCell>
                                                            <ReplyIcon />
                                                        </TableCell>
                                                        <TableCell style={{ paddingLeft: '0px', width: '7%' }}>
                                                            <Avatar
                                                                src={post.icon ? process.env.REACT_APP_API_URL + re.icon : ''}
                                                                style={{
                                                                    color: 'white',
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    // backgroundColor: deepOrange[500],
                                                                    margin: '0px',
                                                                    align: 'right',
                                                                }}
                                                            >
                                                                {re.nickname ? re.nickname.slice(0, 1) : ''}
                                                            </Avatar>
                                                        </TableCell>
                                                        <TableCell style={{ paddingLeft: '0px', width: '10%' }}>
                                                            <p style={{ fontWeight: 'bold' }}>{re.nickname}</p>
                                                            <p>{Moment(re.create_at).fromNow()}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Link
                                                                style={{
                                                                    color: '#4788ff',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            >
                                                                {re['target_nickname'] ? re['target_nickname'] : '' + ' '}
                                                            </Link>
                                                            <TextField
                                                                name="content"
                                                                InputLabelProps={{ shrink: true }}
                                                                fullWidth
                                                                value={re['content'] ? re['content'] : ''}
                                                                multiline
                                                                rows={3}
                                                                rowsMax={3}
                                                                disabled={true}
                                                                style={{
                                                                    cursor: 'default',
                                                                }}
                                                                InputProps={{
                                                                    classes: {
                                                                        input: classes.paddingLTMultilineBlack,
                                                                    },
                                                                    disableUnderline: true,
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell style={{ width: '20%' }}>
                                                            {!re.blind_chk ? (
                                                                <Button
                                                                    width={160}
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    style={{
                                                                        backgroundColor: '#FFAE64',
                                                                    }}
                                                                    onClick={() => {
                                                                        // console.log(re.id)
                                                                        setReId(re.id);
                                                                        setOpen({ ...open, 3: true });
                                                                    }}
                                                                >
                                                                    블라인드
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    width={160}
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        // console.log(re.id)
                                                                        setReId(re.id);
                                                                        setOpen({ ...open, 4: true });
                                                                    }}
                                                                >
                                                                    블라인드 해제
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                              : ''}
                                      </TableBody>
                                  </Table>
                              ))
                            : ''}
                        {reLv0Total > limit ? (
                            <Grid className={classes.tableWrap} style={{ margin: '0px' }}>
                                <Button
                                    onClick={() => {
                                        setOffset(1);
                                        setLimit(limit + 10);
                                    }}
                                    fullWidth={true}
                                >
                                    {' '}
                                    + 더 보기
                                </Button>
                            </Grid>
                        ) : (
                            ''
                        )}
                    </Grid>
                </Grid>
            ) : (
                ''
            )}
        </>
    );
};
