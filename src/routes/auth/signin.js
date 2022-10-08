import clsx from 'clsx';
import React from 'react'
import {httpRequest} from "../../utils/httpReq";
import Copyright from '../../components/copyright'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({

    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },

    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
        padding: '13px',
        color: '#fff',
        fontSize: "20px",
        fontWeight: "bold"
    },

    input: {
        borderColor: '#DDDDDD',
        borderWidth: 1,
        '&:hover': {
            borderColor: '#041E62',
            borderWidth: 2
        },
    },

    borderSide: {
        color: '#041E62',
    },

    title: {
        fontWeight :'bold'
    }
}))

export default (props) => {
    const classes = useStyles()
    const [loginObj, setLoginObj] = React.useState({email: '', password: ''})


    const loginHandler = async e => {
        if (e.preventDefault) {
            e.preventDefault()
        }

        if (loginObj.email.trim().length < 1 || loginObj.password.trim().length < 1) {
            alert('id와 password를 입력해 주세요.')
            return
        }

        const url = '/api/v1/oauth/signin'
        const data = {
            "id": loginObj.email,
            "password": loginObj.password,
            "type": "normal"
        }
        const headers = {
            'Content-type': 'application/json; charset=utf-8'
        }


        const res = await httpRequest('POST', url, headers, JSON.stringify(data))
        // console.log(data);
        // console.log(res);

        if (!res['success'] || res['code'] !== 1000) {
            alert('아이디, 암호를 확인해 주세요.')
            return
        }

        window.localStorage.setItem('token', res['data']['token'])
        window.localStorage.setItem('isLogin', "true")

        window.location.replace('/admin')
    }

    return (
        <Container component="main" maxWidth="xs" style={{marginTop: '10%', backgroundColor: '#fcf9f7'}}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography className={classes.title} component="h1" variant="h5">
                    LIVE
                </Typography>
                <Typography className={classes.title} component="h1" variant="h5">
                    관리자 로그인
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        label="아이디"
                        autoComplete="email"
                        required
                        fullWidth
                        style={{backgroundColor: '#fff'}}
                        value={loginObj.email}
                        onChange={e => setLoginObj({...loginObj, email: e.target.value})}
                        autoFocus
                        InputProps={{
                            classes: {
                                notchedOutline: classes.input
                            }
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        label="비밀번호"
                        type="password"
                        required
                        fullWidth
                        style={{backgroundColor: '#fff'}}
                        value={loginObj.password}
                        onChange={e => setLoginObj({...loginObj, password: e.target.value})}
                        autoComplete="current-password"
                        InputProps={{
                            classes: {
                                notchedOutline: classes.input
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={loginHandler}
                    >
                        로그인
                    </Button>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    )

}