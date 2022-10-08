import 'date-fns';
import clsx from 'clsx';
import React, { useEffect } from 'react'
import PropTypes from "prop-types";

import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


import Moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import { httpRequest } from "../../utils/httpReq";
import { Pagination } from "@material-ui/lab";
import Checkbox from "@material-ui/core/Checkbox";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import DialogAlert, { AlertText } from "../../utils/dialogAlert";
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Radio from "@material-ui/core/Radio";
import { green } from "@material-ui/core/colors";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ReBarChart from '../../components/ReBarChart'
import BarLineChart from '../../components/BarLineChart'
import InputBase from '@material-ui/core/InputBase';
import NativeSelect from '@material-ui/core/NativeSelect';


import func from "../../utils/functions";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const GreenRadio = withStyles({
    root: {
        "&$checked": {
            color: green[600]
        }
    },
    checked: {}
})((props) => <Radio color="default" {...props} />);

const MyTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
        borderRadius: '2px'
    },
    indicator: {
        backgroundColor: '#041E62',
    },
})(Tabs);

const MyTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        background: "#F5F5F5",
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#041E62',
            opacity: 1,
        },
        '&$selected': {
            color: '#041E62',
            fontWeight: "bold",
            background: "#FFFFFF",
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e8e8e8',
        },
        '&:focus': {
            color: '#041E62',
        },
    },
    selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default (props) => {

    const {
        classes,
        history
    } = props

    const styles = useStyles();

    const status_chk = (item) => {
        if (window.sessionStorage.getItem(item)) {
            return window.location.pathname === window.sessionStorage.getItem('path');
        }
        return false
    }

    const [state, setState] = React.useState({})
    const [total, setTotal] = React.useState()
    const [chartData, setChartData] = React.useState([]);
    const [years, setYears] = React.useState([]);
    const [year, setYear] = React.useState(new Date().getFullYear());

    const [status, setStatus] = React.useState(-1);
    const [page, setPage] = React.useState(status_chk('page') ? parseInt(window.sessionStorage.getItem('page')) : 1)

    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);

    const [open, setOpen] = React.useState({ 0: false, 1: false, 2: false })
    const [text, setText] = React.useState('')

    const [period, setPeriod] = React.useState("week")
    const [week, setWeek] = React.useState("this")
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    useEffect(() => {
        dataReq()
    }, [period, week, selectedDate, year])

    useEffect(() => {
        setSelYears();
    }, [])

    const removeToken = () => {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }

    const setSession = (_page, _type) => {

        // console.log(page);

        window.sessionStorage.setItem("page", _page ? _page : page)
        window.sessionStorage.setItem("path", window.location.pathname)

        // console.log(window.sessionStorage)
    }

    const removeSession = async () => {
        for (const [k] of Object.entries(window.sessionStorage)) {
            window.sessionStorage.removeItem(k)
        }
    }

    const moreBtnHandler = (d) => {
        setSession()
        history.push('/admin/earnings/sponsor/item/{0}/{1}?'.format(d.video_post_id > 0 ? "video" : "creator", d.id))
    }

    let data = {}

    const dataReq = () => {
        return new Promise(async (r, e) => {

            // console.log(period, week, selectedDate);

            let date = Moment(selectedDate).format("YYYY-MM-DD")
            let url;

            if (period === "week") {

                let a
                week === "this" ? a = "Week" : a = "7days";

                url = `/api/v1/admin/statistics/day/in${a}/login?date=${date}`
            } else {

                url = `/api/v1/admin/statistics/month/in-year/login?date=${year}-01-01`
            }

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

            let resData = res["data"] ? res["data"] : [];

            // console.log(res);

            let _data = [];
            let __week = ['일', '월', '화', '수', '목', '금', '토']

            if (period === "week") {

                if (week === "this") {

                    /// 바 차트 설정
                    let startDate = new Date(selectedDate)
                    startDate.setDate(startDate.getDate() - ((startDate.getDay() === 0 ? 7 : startDate.getDay()) - 1));

                    for (let i = 1; i < 8; i++) {

                        let item = {
                            date: Moment(startDate).format('MM.DD'),
                            dayOfWeek: startDate.getDay() + 1,
                            access_cnt: 0,
                            name: `${Moment(startDate).format('MM.DD')} \n ${__week[startDate.getDay()]}`,
                            dayOfWeek_kr: __week[startDate.getDay()]
                        }

                        startDate.setDate(startDate.getDate() + 1)
                        _data.push(item)
                    }

                    for (let item of resData) {

                        _data[item.dayofweek - 2 >= 0 ? item.dayofweek - 2 : item.dayofweek - 2 + 7].access_cnt = item.access_cnt
                    }

                } else {

                    let startDate = new Date(selectedDate)
                    startDate.setDate(startDate.getDate() - 6)
                    // startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));

                    for (let i = 1; i < 8; i++) {

                        let item = {
                            date: Moment(startDate).format('MM.DD'),
                            dayOfWeek: startDate.getDay() + 1,
                            access_cnt: 0,
                            name: `${Moment(startDate).format('MM.DD')} \n ${__week[startDate.getDay()]}`,
                            dayOfWeek_kr: __week[startDate.getDay()]
                        }

                        startDate.setDate(startDate.getDate() + 1)
                        _data.push(item)
                    }

                    for (let item of resData) {
                        _data[item.idx - 1].access_cnt = item.access_cnt
                    }
                }

            } else {

                for (let i = 0; i < 12; i++) {

                    let item = {
                        // name: `${year}-${String((i+1)).length !== 2 ? "0"+(i+1) : (i+1)}월`,
                        name: `${String((i + 1)).length !== 2 ? "0" + (i + 1) : (i + 1)}월`,
                        access_cnt: 0
                    }
                    _data.push(item)
                }

                for (let item of resData) {
                    _data[item.idx - 1].access_cnt = item.access_cnt
                }
                // console.log(year)
            }

            // console.log(_data)
            setChartData(_data)
        })
    }

    const setSelYears = () => {

        let date = new Date();

        let arr = [date.getFullYear()];

        for (let i = 0; i < 9; i++) {

            date.setFullYear(date.getFullYear() - 1)
            arr.push(date.getFullYear());
        }

        // console.log(arr);
        setYears(arr);
    }

    const handleTabChange = (e, val) => {
        // console.log(val)

        setPeriod(val);
        setWeek("this")
        setSelectedDate(new Date());
    };

    const handleRadioChange = (e) => {
        // console.log(e.target.value);
        setWeek(e.target.value);
    };

    const handleSelChange = (event) => {
        setYear(event.target.value);
    };

    const openAlert = (text) => {
        setText(text)
        setOpen({ 0: false, 1: false, 2: true })
        setTimeout(function () {
            setOpen({ 0: false, 1: false, 2: false })
        }, 700);
    }

    const handleDateChange = (date) => {
        // console.log(date)
        setSelectedDate(date);
    };

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Typography component="h2" variant="h5" color="initial" gutterBottom
                            style={{ paddingTop: '5px', margin: 0 }} onClick={() => { }}>
                            활동량 조회
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <br /><br />

            <Grid>
                <MyTabs
                    value={period}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabChange}
                    aria-label="disabled tabs example"
                >
                    <MyTab value={"week"} style={{ paddingLeft: "30px", paddingRight: "30px" }} label="주별 조회" />
                    <MyTab value={"month"} style={{ paddingLeft: "30px", paddingRight: "30px" }} label="월별 조회" />
                </MyTabs>
            </Grid>
            <Grid className={classes.tableWrap} style={{ marginTop: "0px" }}>
                <Grid className={classes.paper}>
                    {period === "week" ?
                        <TextField
                            className={classes.marginTop10}
                            style={{ marginLeft: '10px', marginTop: "30px", marginBottom: "10px" }}
                            InputProps={{
                                readOnly: true,
                                disableUnderline: true, classes: { input: classes.fontSize22 }
                            }}
                            value="일별 접속 수" /> :
                        <TextField
                            className={classes.marginTop10}
                            style={{ marginLeft: '10px', marginTop: "30px", marginBottom: "10px" }}
                            InputProps={{
                                readOnly: true,
                                disableUnderline: true, classes: { input: classes.fontSize22 }
                            }}
                            value="월별 접속 수" />
                    }
                    <Paper className={classes.paper} style={{ paddingLeft: "30px", paddingTop: "20px" }}>
                        {period === "week" ?
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={2}>
                                    <h3 style={{ marginTop: "10px" }}>기간 설정</h3>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend"></FormLabel>
                                        <RadioGroup value={week} row aria-label="position" name="position"
                                            defaultValue="top" onChange={handleRadioChange}>
                                            <FormControlLabel
                                                value="this"
                                                control={<Radio color="primary" />}
                                                label="이번주" />
                                            <FormControlLabel
                                                value="7ago"
                                                control={<GreenRadio />}
                                                label="1주 전" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            style={{ marginTop: "0px" }}
                                            disableToolbar
                                            variant="inline"
                                            format="yyyy-MM-dd"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label=""
                                            autoOk={true}
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button
                                        className="btn-choose"
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '10px', paddingLeft: "40px", paddingRight: "40px" }}
                                        component="span"
                                        onClick={async () => {
                                            await dataReq()
                                        }}
                                    >
                                        적용
                                    </Button>
                                </Grid>
                            </Grid> :
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                </Grid>
                                <Grid item xs={12} sm={4}
                                >
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl className={styles.formControl}>
                                        <InputLabel id="demo-mutiple-chip-label">Year</InputLabel>
                                        <Select
                                            labelId="demo-mutiple-chip-label"
                                            id="demo-mutiple-chip"
                                            value={year}
                                            label={"Year"}
                                            onChange={handleSelChange}
                                            style={{
                                                textAlign: "center"
                                            }}
                                        >
                                            {years[0] ? years.map((row, idx) => (
                                                <MenuItem key={idx} value={row}>{row}</MenuItem>
                                            ))
                                                : <MenuItem></MenuItem>
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        }
                    </Paper>
                    <Paper className={classes.paper}
                        style={{ marginTop: "15px", paddingLeft: "30px", paddingTop: "20px" }}>
                        {period === "week" ?
                            <ReBarChart chartData={chartData} />
                            :
                            // <ReBarChart chartData = {chartData}/>
                            <BarLineChart chartData={chartData} />
                        }
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}