import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NavItem from 'conf/navItem';

import { SignIn } from 'routes/auth';

import Dashboard from 'routes/dashboard';

import { UserList, UserItem, PointHistory, ReplyHistory, SponsoredHistory, SponsoringHistory, VideHistory, SuspendList, RetireList, Activity, CreatorApply, CreatorApplyItem } from 'routes/user';

import { PostList, PostItem, PostSearch, PostBlindList, PostCuration, PostTag, PostThemeList, PostThemeItem } from 'routes/postManage';

import { ReportVideoList, ReportReplyList, ReportVideoItem, ReportReplyItem } from 'routes/report';

import { ChargeList, ChargeItem } from 'routes/charge';
import { SponsorList, SponsorVideo, SponsorCreator } from 'routes/sponsor';
import { AdjustmentList, AdjustmentItem } from 'routes/adjustment';

import { NoticeList, NoticeItem } from 'routes/notice';
import { IntroList, IntroItem } from 'routes/intro';
import { SuggestList, SuggestItem } from 'routes/suggest';

import '../conf/videoStyle.css';

export default (props) => {
    const components = {
        /* 홈 메뉴 */
        signIn: SignIn,
        dashboard: Dashboard,

        /* 회원 관리 */
        userList: UserList,
        userItem: UserItem,

        videHistory: VideHistory,
        replyHistory: ReplyHistory,

        pointHistory: PointHistory,
        sponsoringHistory: SponsoringHistory,
        sponsoredHistory: SponsoredHistory,

        suspendList: SuspendList,
        retireList: RetireList,

        activity: Activity,

        creatorApply: CreatorApply,
        creatorApplyItem: CreatorApplyItem,

        /* 게시물 관리 */
        postList: PostList,
        postItem: PostItem,
        postSearch: PostSearch,
        postBlindList: PostBlindList,
        postCuration: PostCuration,
        postTag: PostTag,
        postThemeList: PostThemeList,
        postThemeItem: PostThemeItem,

        /* 신고 관리 */
        reportVideoList: ReportVideoList,
        reportVideoItem: ReportVideoItem,
        reportReplyList: ReportReplyList,
        reportReplyItem: ReportReplyItem,

        /* 수익 관리 */
        chargeList: ChargeList,
        chargeItem: ChargeItem,
        sponsorList: SponsorList,
        sponsorVideo: SponsorVideo,
        sponsorCreator: SponsorCreator,
        adjustmentList: AdjustmentList,
        adjustmentItem: AdjustmentItem,

        /* 서비스 관리 */
        noticeList: NoticeList,
        noticeItem: NoticeItem,
        introList: IntroList,
        introItem: IntroItem,
        suggestList: SuggestList,
        suggestItem: SuggestItem,
    };

    const navItem = NavItem(components);

    if (!navItem || navItem instanceof Array === false || navItem.length < 1) {
        return '';
    }

    // console.log(navItem)

    return (
        <Switch>
            {navItem.map((nav, navIdx) => {
                let pages = nav.pages;

                // pages.push({exact: true, path: '/admin', component: components['dashboard']})

                // console.log("!!!", pages)
                // console.log(window.location.pathname)
                /*if (window.location.pathname === "/admin") {
                            return (
                                <Route key={'main'} exact path='/admin'
                                       render={({match}) => <Dashboard {...props} match={match}/>}
                                />)
                        }*/

                if (!nav.pages || nav.pages instanceof Array === false || nav.pages.length < 1) {
                    // return ''
                    return <Route key={'main'} exact path="/admin" render={({ match }) => <Dashboard {...props} match={match} />} />;
                }

                return pages.map((route, routeIdx) => {
                    if (!route.component) {
                        return '';
                    }

                    return <Route key={'app-nav-{0}-route-{1}'.format(navIdx, routeIdx)} exact={route.exact} path={route.path} render={({ match }) => <route.component {...props} match={match} />} />;
                });
            })}
        </Switch>
    );
};
