const drawerWidth = 300

export default (theme) => {
    return {
        root: {
            display: 'flex',
        },
        toolbar: {
            paddingRight: 24, // keep right padding when drawer closed
        },
        toolbarIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...theme.mixins.toolbar,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        menuButtonHidden: {
            display: 'none',
        },
        title: {
            flexGrow: 1,
            color: 'white'
        },
        drawerPaper: {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerPaperClose: {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        fixedHeight: {
            minHeight: 300,
        }, image: {
            maxWidth: '300px'
        },
        marginTop30: {
            marginTop: 30
        },
        marginTop20: {
            marginTop: 20
        },
        marginTop10: {
            marginTop: 10
        }, marginBottom30: {
            marginBottom: 30
        },
        marginBottom20: {
            marginBottom: 20
        },
        marginBottom10: {
            marginBottom: 10
        },
        textColorWhite: {
            color: '#fff'
        },
        tableWrap: {
            position: 'relative',
            marginTop: '30px',
            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            flexGrow: 1,
            backgroundColor: '#fff'
        },
        tableTop: {
            minHeight: '90px',
            paddingLeft: '24px',
            paddingRight: '24px',
            display: 'inlineFlex',
            position: 'relative',
            alignItems: 'center',

        },
        tableTitle: {
            fontSize: '20px',
            fontWeight: '500'
        },
        tableWhiteSpace: {
            flex: '1 1 10%'
        },
        tableSearch: {
            padding: '5px',
            marginLeft: '20px'
        },
        tablePost: {
            padding: '1px',
            paddingTop: '5px',
            paddingBottom: '5px'
        },
        tablePostWithoutBorder: {
            padding: '1px',
            borderBottom: "0px"
        },
        tablePostViewHead: {
            padding: '10px',
            borderBottom: "0px"
        },
        tablePostViewBody: {
            paddingTop: '0px',

        },
        postViewSpan: {
            padding: '10px',
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "18px",
            lineHeight: "23px",
            color: '#5C5C5C',
        },
        postViewFont: {
            fontFamily: "Roboto",
            color: '#5C5C5C',
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "15px",
            lineHeight: "19px"
        },
        listButtonCell: {
            padding: '10px',
            width: '180px'
        },
        listButton: {
            color: '#6984B5',
            padding: '8px'
        },
        modalPaper : {

            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
            // position: "absolute",
            width: "90%",
            height: "90%",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            // padding: theme.spacing(2, 4, 3)
        },
        menuWarp: {
            borderBottom: '1px solid #ececec',
            height: '50px',
        },
        listBorderBottom: {
            borderBottom: '2px solid #ececec'
        },
        labelFont : {
            fontSize: '13px',
            padding : 0,
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: "400",
            lineHeight: "1",
            letterSpacing: "0.00938em",
            color: "rgba(0, 0, 0, 0.54)"
        },
        fontSize22: {
            fontSize: '19px'
        },
        fontSize18: {
            fontSize: '20px',
            padding: 0
        },
        fontSize13: {
            fontSize: '13px'
        }, fontSize1: {
            fontSize: '5px'
        },
        colorBlack: {
            color: '#000'
        },
        dateFont: {
            color: '#999999',
            fontSize: '12px'
        },
        inputText: {
            color: 'rgba(0,0,0,0.87)',
            fontSize: '16px',
            letterSpacing: '0.5px',
            lineHeight: '28px',
            textAlign: 'center',
        },
        dialogBackDrop: {
            background: 'rgba(0,0,0,0)'
        },
        dialogColor: {
            backgroundColor: 'rgba(0,0,0,0.56)',
            color: '#ffffff',
        },
        tableCell: {
            padding: '10px',
        },
        tableCellNotBorder: {
            padding: '7px',
            borderBottom: "0px"
        },
        tableCellNotBorderPadding0: {
            padding: '0px',
            borderBottom: "0px"
        },
        iconColor: {
            color: '#6984B5'
        },
        paddingLT: {
            padding: '7px 14px'
        },
        paddingLTMultilineBlack: {
            padding: '7px 14px',
            color: 'black'
        },
        paddingLTTags: {
            padding: '7px 14px',
            color: '#4788ff'
        },
        pagination: {
            backgroundColor: '#fff'
        },
        borderWhite: {
            '&: before': {
                border: 0
            }
        },
        chatBox: {
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '-4px 4px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
        }


    }
}