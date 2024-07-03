import clsx from 'clsx';
import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Container from '@material-ui/core/Container';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SideNav from 'sideNav';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Copyright from 'components/copyright';
import StyleItem from 'conf/style';
import 'utils/formatter';
import Routes from 'routes';
import { SignIn } from './routes/auth';
import 'video-react/dist/video-react.css';
import logo from 'flatform_log.png';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import salesIcon from 'sales.png';
import userIcon from 'user.png';
import accessIcon from 'access.png';

const useStyles = makeStyles((theme) => StyleItem(theme));

const Containers = withStyles({
    root: {
        ['@media (min-width: 1280px)']: {
            '&.MuiContainer-maxWidthLg': {
                maxWidth: '1400px',
            },
        },
    },
})(Container);

export default () => {
    const classes = useStyles();

    const history = createBrowserHistory();
    const [locInfo, setLocInfo] = React.useState({ parent: '', child: '' });
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [isLogin, setIsLogin] = React.useState(false);

    useEffect(() => {
        initApp();
    }, [isLogin]);

    const logoutBtn = (e) => {
        if (e.preventDefault) {
            e.preventDefault();
        }
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('isLogin');

        window.location.replace('/admin');
    };

    let initApp = async () => {
        if (window.localStorage.length > 0 && window.localStorage.getItem('isLogin')) {
            setIsLogin(window.localStorage.getItem('isLogin') === 'true');
        }
    };

    let renderApp = () => {
        if (isLogin) {
            return (
                <div className={clsx('App', classes.root)}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}>
                                <MenuIcon />
                            </IconButton>
                            <img
                                style={{
                                    marginRight: '5px',
                                }}
                                src={logo}
                                width={50}
                                alt=""
                                onClick={() => {
                                    history.replace('/admin');
                                }}
                            />
                            <Typography component={Link} color="initial" underline="none" href="/admin" variant="h6" noWrap className={classes.title}>
                                LIVE
                            </Typography>
                            <Tooltip title="로그아웃" style={{ color: '#fff' }} onClick={logoutBtn}>
                                <IconButton color="inherit">
                                    <ExitToAppIcon />
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
                        }}
                        open={drawerOpen}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={handleDrawerClose}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <SideNav locInfo={locInfo} history={history} />
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />
                        <Containers maxWidth="lg" className={classes.container}>
                            <Router history={history}>
                                <Routes history={history} classes={classes} />
                            </Router>
                            <Box mt={8}>
                                <Copyright />
                            </Box>
                        </Containers>
                    </main>
                </div>
            );
        } else {
            return <SignIn history={history} classes={classes} />;
        }
    };

    return renderApp();
};
