import React from 'react'

import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import DashboardIcon from '@material-ui/icons/Dashboard';

import FaceIcon from '@material-ui/icons/Face';
import FeedbackIcon from '@material-ui/icons/Feedback';
import NotesIcon from '@material-ui/icons/Notes';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import VideocamIcon from '@material-ui/icons/Videocam';
import ReportIcon from '@material-ui/icons/Report';
import PaymentIcon from '@material-ui/icons/Payment';
import EventNoteIcon from '@material-ui/icons/EventNote';
import RoomServiceIcon from '@material-ui/icons/RoomService';

export default components => {

    let start = [{exact: true, path: '/admin', component: components['dashboard']}]

    return [
        {
            name: 'member',
            label: '회원 관리',
            selected: false,
            icon: <FaceIcon/>,
            children: [
                {
                    name: 'user',
                    label: '회원 목록',
                    selected: false,
                    link: '/admin/member/user/list',
                },
                {
                    name: 'stop',
                    label: '정지 회원 목록',
                    selected: false,
                    link: '/admin/member/stop/list',
                },
                {
                    name: 'retire',
                    label: '탈퇴 사유 확인',
                    selected: false,
                    link: '/admin/member/retire',
                },
                {
                    name: 'apply',
                    label: '크리에이터 신청 목록',
                    selected: false,
                    link: '/admin/member/apply/list',
                },
                {
                    name: 'activity',
                    label: '활동량 조회',
                    selected: false,
                    link: '/admin/member/activity',
                },
            ],
            pages: [
                ...start,
                {exact: true, path: '/admin/member/user/list', component: components['userList']},
                {exact: true, path: '/admin/member/user/item/:id', component: components['userItem']},
                {exact: true, path: '/admin/member/user/item', component: components['userItem']},

                {exact: true, path: '/admin/member/user/point/:id', component: components['pointHistory']},
                {exact: true, path: '/admin/member/user/sponsoring/:id', component: components['sponsoringHistory']},
                {exact: true, path: '/admin/member/user/sponsored/:id', component: components['sponsoredHistory']},
                {exact: true, path: '/admin/member/user/reply/:id', component: components['replyHistory']},
                {exact: true, path: '/admin/member/user/video/:id', component: components['videHistory']},


                {exact: true, path: '/admin/member/stop/list', component: components['suspendList']},


                {exact: true, path: '/admin/member/retire', component: components['retireList']},

                {exact: true, path: '/admin/member/apply/list', component: components['creatorApply']},
                {exact: true, path: '/admin/member/apply/item/:id', component: components['creatorApplyItem']},
                {exact: true, path: '/admin/member/apply/item', component: components['creatorApplyItem']},


                {exact: true, path: '/admin/member/activity', component: components['activity']},
            ],
        },
        {
            name: 'post',
            label: '게시물 관리',
            selected: false,
            icon: <VideocamIcon/>,
            children: [
                {
                    name: 'postList',
                    label: '게시물 목록',
                    selected: false,
                    link: '/admin/post/postList/list',
                },
                {
                    name: 'tag',
                    label: '해시태그 관리',
                    selected: false,
                    link: '/admin/post/tag/recommend',
                },
                {
                    name: 'curation',
                    label: '큐레이션 영상 관리',
                    selected: false,
                    link: '/admin/post/curation/manage',
                },
                {
                    name: 'theme',
                    label: '영상 테마 관리',
                    selected: false,
                    link: '/admin/post/theme/list',
                },
                {
                    name: 'blind',
                    label: '블라인드 게시물',
                    selected: false,
                    link: '/admin/post/blind/list',
                },

            ],
            pages: [
                {exact: true, path: '/admin/post/postList/list', component: components['postList']},
                {exact: true, path: '/admin/post/postList/search', component: components['postSearch']},
                {exact: true, path: '/admin/post/postList/item/:id', component: components['postItem']},
                {exact: true, path: '/admin/post/postList/item', component: components['postItem']},

                {exact: true, path: '/admin/post/tag/recommend', component: components['postTag']},
                {exact: true, path: '/admin/post/tag/:id', component: components['postTag']},

                {exact: true, path: '/admin/post/curation/manage', component: components['postCuration']},

                {exact: true, path: '/admin/post/theme/list', component: components['postThemeList']},
                {exact: true, path: '/admin/post/theme/item/:id', component: components['postThemeItem']},
                {exact: true, path: '/admin/post/theme/item', component: components['postThemeItem']},

                {exact: true, path: '/admin/post/blind/list', component: components['postBlindList']},
            ],
        },
        {
            name: 'report',
            label: '신고 관리',
            selected: false,
            icon: <ReportIcon/>,
            children: [
                {
                    name: 'video',
                    label: '영상 신고 내역',
                    selected: false,
                    link: '/admin/report/video/list',
                },
                {
                    name: 'reply',
                    label: '댓글 신고 내역',
                    selected: false,
                    link: '/admin/report/reply/list',
                }
            ],
            pages: [
                {exact: true, path: '/admin/report/video/list', component: components['reportVideoList']},
                {exact: true, path: '/admin/report/video/item/:id', component: components['reportVideoItem']},
                {exact: true, path: '/admin/report/video/item', component: components['reportVideoItem']},
                {exact: true, path: '/admin/report/reply/list', component: components['reportReplyList']},
                {exact: true, path: '/admin/report/reply/item/:id', component: components['reportReplyItem']},
                {exact: true, path: '/admin/report/reply/item', component: components['reportReplyItem']},
            ],
        },
        {
            name: 'earnings',
            label: '수익 관리',
            icon: <PaymentIcon/>,
            selected: false,
            children: [
                {
                    name: 'charge',
                    label: '포인트 충전 내역',
                    selected: false,
                    link: '/admin/earnings/charge/list',
                },
                {
                    name: 'sponsor',
                    label: '후원 내역',
                    selected: false,
                    link: '/admin/earnings/sponsor/list',
                },
                {
                    name: 'adjustment',
                    label: '정산 내역',
                    selected: false,
                    link: '/admin/earnings/adjustment/list',
                }

            ],
            pages: [
                {exact: true, path: '/admin/earnings/charge/list', component: components['chargeList']},
                {exact: true, path: '/admin/earnings/charge/item/:id', component: components['chargeItem']},
                {exact: true, path: '/admin/earnings/charge/item', component: components['chargeItem']},
                {exact: true, path: '/admin/earnings/sponsor/list', component: components['sponsorList']},
                {exact: true, path: '/admin/earnings/sponsor/item/video/:id', component: components['sponsorVideo']},
                {exact: true, path: '/admin/earnings/sponsor/item/video', component: components['sponsorVideo']},
                {
                    exact: true,
                    path: '/admin/earnings/sponsor/item/creator/:id',
                    component: components['sponsorCreator']
                },
                {exact: true, path: '/admin/earnings/sponsor/item/creator', component: components['sponsorCreator']},
                {exact: true, path: '/admin/earnings/adjustment/list', component: components['adjustmentList']},
                {exact: true, path: '/admin/earnings/adjustment/item/:id', component: components['adjustmentItem']},
                {exact: true, path: '/admin/earnings/adjustment/item', component: components['adjustmentItem']}
            ],
        },
        {
            name: 'service',
            label: '서비스 관리',
            icon: <RoomServiceIcon/>,
            selected: false,
            children: [
                {
                    name: 'notice',
                    label: '공지사항',
                    selected: false,
                    link: '/admin/service/notice/list',
                },
                {
                    name: 'intro',
                    label: '소개 업로드',
                    selected: false,
                    link: '/admin/service/intro/list',
                    pages: [],
                },
                {
                    name: 'suggest',
                    label: '건의 내역',
                    selected: false,
                    link: '/admin/service/suggest/list',
                }
            ],
            pages: [
                {exact: true, path: '/admin/service/notice/list', component: components['noticeList']},
                {exact: true, path: '/admin/service/notice/item/:id', component: components['noticeItem']},
                {exact: true, path: '/admin/service/notice/item', component: components['noticeItem']},
                {exact: true, path: '/admin/service/intro/list', component: components['introList']},
                {exact: true, path: '/admin/service/intro/item/:id', component: components['introItem']},
                {exact: true, path: '/admin/service/intro/item', component: components['introItem']},
                {exact: true, path: '/admin/service/suggest/list', component: components['suggestList']},
                {exact: true, path: '/admin/service/suggest/item/:id', component: components['suggestItem']},
                {exact: true, path: '/admin/service/suggest/item', component: components['suggestItem']}
            ],
        },

    ]
}

