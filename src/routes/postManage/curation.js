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
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "@material-ui/core/Modal";
import SearchVideo from "./search"
import { Player } from "video-react";
import HLSSource from "../../components/HLSSource";

const YellowCheckbox = withStyles({
    root: {
        color: "primary",
        '&$checked': {
            color: "#FFAE64",
        },
    },
    checked: {},
})(Checkbox);


function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 7;
    const left = 8;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(${top}%, ${left}%)`
    };
}


export default (props) => {
    const { classes, history, match } = props
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

    const [modalStyle] = React.useState(getModalStyle);

    const [title, setTitle] = React.useState("")
    const [videos, setVideos] = React.useState([]);
    const [curationId, setCurationId] = React.useState(0);

    const [selected, setSelected] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);

    const [delVideo, setDelVideo] = React.useState(new Set)



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

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }


    const dataReq = (q) => {
        return new Promise(async (r, e) => {

            /*if (!match.params.id) {
                 return
             }*/

            let url = '/api/v1/admin/post/owner/curation'
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

                setTitle("")
                setVideos([])
                setCurationId(0)
                return
            }

            // console.log(res)

            setCurationId(res['data']["id"])
            setTitle(res['data']["title"])
            setVideos(res['data']["list"])
        })
    }


    const save = () => {
        setOpen({ 0: false, 1: false, 2: false })
        return new Promise(async (r, e) => {

            // console.log("video",videos)
            // console.log("del",delVideo);
            // console.log("title",title)

            let insVideo = [];

            if (title.length < 1) {
                alert("제목을 입력하세요.")
                return
            }

            else if (videos.length < 1) {
                alert("영상을 등록하세요.")
                return
            }
            else if (videos.length > 5) {
                alert("영상은 5개만 등록 가능합니다.")
                return
            }

            for (let item of videos) {

                if (!item.parent_id) {

                    if (!delVideo.has(item.id)) {
                        insVideo.push(item.id)
                    }
                    else {
                        delVideo.delete(item.id)
                    }
                }
            }

            let data = {
                "id": curationId > 0 ? curationId : null,
                "title": title,
                "ins_videos": insVideo,
                "del_videos": [...delVideo]
            }

            //  console.log(data);

            let url = '/api/v1/admin/post/owner/curation/register'

            const headers = {
                'token': window.localStorage.getItem('token'),
                'Content-type': 'application/json; charset=utf-8'
            }


            const res = await httpRequest('POST', url, headers, JSON.stringify(data))

            //  console.log(res)

            if (!res['success'] || res['code'] !== 1000) {
                alert('실패')
                return
            }

            openAlert("정상 처리 되었습니다")

            setTimeout(function () {
                window.location.reload()
            }, 700)
        })
    }



    const handelOpenModal = () => {
        setModalOpen(true);
    };

    const handelCloseModal = () => {


        setModalOpen(false);
    };

    const changeValue = (e) => {

        let val = { ...videos }

        val[e.target.name] = e.target.value

        //  console.log(val);

        // setState(val)
    }

    const handleSelectAllClick = (e) => {

        if (e.target.checked) {

            // console.log(videos)
            const newSelects = videos.map((n) => {

                return {
                    id: n.id,
                    parent_id: n.parent_id
                }
            });

            document.querySelectorAll(".MuiTableRow-hover").forEach(item => {

                item.style.background = "#E0E7F7"
            })

            setSelected(newSelects);
            return;
        }

        document.querySelectorAll(".MuiTableRow-hover").forEach(item => {

            item.style.background = "white"
        })

        setSelected([]);
    };

    const isSelected = (id) => {

        return selected.findIndex(obj => obj.id === id) !== -1;
    }


    const handleClick = (event, id, parent) => {

        // console.log(parent);

        const selectedIndex = selected.findIndex(obj => obj.id === id);

        // console.log(id, selectedIndex, selected)

        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, { id: id, parent_id: parent });
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


    /*   영상 리스트 보기   */
    {/* 영상 리스트 관련 함수 */ }
    const clickChkBox = (e, row) => {
        e.preventDefault();
        document.querySelector(`#v${row.id}`).click()
    }


    const deleteVideo = () => {

        //  console.log("sel",selected);
        //   console.log("vid", videos)
        //   console.log("be del", delVideo);

        let i = 0;

        for (let sel of selected) {
            if (sel.parent_id) {
                delVideo.add(sel.id)
            }

            let idx = videos.findIndex(obj => obj.id === sel.id)

            if (idx > -1) {
                videos.splice(idx, 1);
            }
        }

        setSelected([]);
        setVideos(videos);
        //  console.log("after del", delVideo);
        //  console.log(videos);
    }

    return (
        <>
            <DialogAlert open={open[0]} handleClose={() => setOpen({ ...open, 0: false })} text={"저장 하시겠습니까?"}
                fn={() => save()} />
            <AlertText open={open[2]} handleClose={() => setOpen({ ...open, 2: false })} text={text} classes={classes} />
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => {
                                // console.log(videos)
                            }}>
                            큐레이션 영상 관리
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>

                    </Grid>
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
                        >저장</Button>
                    </Grid>
                </Grid>
            </Paper>
            <TextField
                className={classes.marginTop30}
                style={{ marginLeft: '10px', marginTop: "50px" }}
                InputProps={{
                    readOnly: true,
                    disableUnderline: true, classes: { input: classes.fontSize22 }
                }}
                value="큐레이션 제목"
            />
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Grid container
                    style={{ padding: "30px" }}
                >
                    <Grid item xs={12}>
                        <TextField
                            label="제목"
                            name="title"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            multiline={true}
                            value={title}
                            inputProps={{
                                maxlength: 100
                            }}
                            helperText={`${title.length}/${100}`}
                            InputProps={{
                                classes: { input: classes.paddingLT }
                            }}
                            onChange={(e) => {

                                let temp = title;

                                temp = e.target.value;
                                setTitle(temp);
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Grid container spacing={3}
                style={{ marginTop: '40px' }}
            >
                <Grid item xs={12} sm={8}>
                    <TextField
                        style={{ marginLeft: '10px' }}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true, classes: { input: classes.fontSize22 }
                        }}
                        value="영상 리스트"
                    />
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
                        onClick={handelOpenModal}
                    >추가</Button>
                    <Modal
                        open={modalOpen}
                        onClose={handelCloseModal}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        <SearchVideo
                            videos={videos}
                            addVideos={setVideos}
                            unchkVideos={delVideo}
                            deleteVideos={setDelVideo}
                            modalOpen={modalOpen}
                            modalHandler={setModalOpen}
                            initialSelect={setSelected}
                            classes={classes}
                            style={modalStyle} />
                    </Modal>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            deleteVideo();
                        }}
                    >삭제</Button>
                </Grid>
            </Grid>

            {/* 영상 리스트 */}
            <Paper className={clsx(classes.paper, classes.marginTop10)} style={{ width: '100%' }}>
                <Grid>
                    <TableContainer>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <YellowCheckbox
                                            className={classes.tableCell}
                                            indeterminate={selected.length > 0 && selected.length < videos.length}
                                            checked={videos.length > 0 && selected.length === videos.length}
                                            onChange={handleSelectAllClick}
                                            inputProps={{ "aria-label": "select all post" }}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell className={classes.tableCell} align="center">작성자</TableCell>
                                    <TableCell className={classes.tableCell} align="center"
                                        style={{ paddingLeft: '40px' }}
                                    >제목</TableCell>
                                    <TableCell className={classes.tableCell} align="center">조회수</TableCell>
                                    <TableCell className={classes.tableCell} align="center">평점</TableCell>
                                    <TableCell className={classes.tableCell} align="center">박수</TableCell>
                                    <TableCell className={classes.tableCell} align="center">댓글</TableCell>
                                    <TableCell className={classes.tableCell} align="center">찜</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {videos[0] ? videos.map((row, index) => (
                                    <TableRow key={row.id} id={"t" + row.id}
                                        style={
                                            isSelected(row.id) ? { backgroundColor: "#E0E7F7" } : { backgroundColor: "white" }
                                        }
                                        hover>
                                        <TableCell padding="checkbox">
                                            <YellowCheckbox
                                                id={"v" + row.id}
                                                inputProps={{ "aria-labelledby": `enhanced-table-checkbox-${index}` }}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleClick(e, row.id, row.parent_id)
                                                    !isSelected(row.id) ?
                                                        document.querySelector(`#t${row.id}`).style.backgroundColor = "#E0E7F7" :
                                                        document.querySelector(`#t${row.id}`).style.backgroundColor = "white"
                                                }}
                                                checked={isSelected(row.id)}
                                            />
                                        </TableCell>

                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={(e) => {
                                                clickChkBox(e, row)
                                            }}
                                        >{row.nickname}</TableCell>

                                        <TableCell className={classes.tableCell}
                                            align="left"
                                            style={
                                                {
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px'
                                                }}

                                        >
                                            <TableCell
                                                style={
                                                    {
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                        borderBottom: "0px"
                                                    }}
                                            >
                                                <Player
                                                    poster={row.thumbnail ? process.env.REACT_APP_API_URL + row.thumbnail : ""}
                                                    fluid={false} width={220} height={120} controls
                                                >
                                                    <HLSSource
                                                        isVideoChild
                                                        inactive={true}
                                                        src={process.env.REACT_APP_VIDEO_URL + row.video}
                                                    />
                                                </Player>
                                                {/*<img src={process.env.REACT_APP_API_URL + row.thumbnail}*/}
                                                {/*     height="100px" width="120px"/>*/}
                                            </TableCell>
                                            <TableCell
                                                style={
                                                    {
                                                        paddingTop: '0px',
                                                        paddingBottom: '0px',
                                                        borderBottom: "0px",
                                                        width: "100%"
                                                    }}
                                                onClick={(e) => {
                                                    clickChkBox(e, row)
                                                }}
                                            >
                                                <TextField
                                                    // className={classes.marginTop30}
                                                    style={{ marginLeft: '10px' }}
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
                                            onClick={(e) => {
                                                clickChkBox(e, row)
                                            }}
                                        >{row.view_cnt}</TableCell>
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={(e) => {
                                                clickChkBox(e, row)
                                            }}
                                        >{row.score}</TableCell>
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={(e) => {
                                                clickChkBox(e, row)
                                            }}
                                        >{row.like_cnt}</TableCell>
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={(e) => {
                                                clickChkBox(e, row)
                                            }}
                                        >{row.reply_cnt}</TableCell>
                                        <TableCell className={classes.tableCell}
                                            align="center"
                                            onClick={(e) => {
                                                clickChkBox(e, row)
                                            }}
                                        >{row.dibs_cnt}</TableCell>

                                    </TableRow>
                                )) : <TableRow></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Paper>
        </>
    )
}