export default {
    fetch: (method, uri, params, options) => {
        const init = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            method: method ? method.toUpperCase() : 'GET',
        };

        if (init.method === 'GET' || init.method === 'DELETE') {
            if (params) {
                uri = uri + '?' + Object.keys(params)
                    .map((key) =>
                        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
                    .join('&');
            }
        } else {
            if (params) {
                init.body = JSON.stringify(params);
            }
        }

        if (options && options.headers) {
            init.headers = Object.assign({}, init.headers, options.headers);
        }

        let data = [];

        switch (method.toLowerCase()) {
            case 'get':
                switch (uri) {
                    case '/api/movies':
                        data = [{
                            "_id": "59d8b30bbfb1513a12ae195b",
                            "movieCd": "20171817",
                            "movieNm": "넛잡 2",
                            "theater": "CGV",
                            "showTime": "3PM"
                        }, {
                            "_id": "59d8c7ab2f2e4a414cbe848b",
                            "movieCd": "20174142",
                            "movieNm": "아이 캔 스피크",
                            "theater": "Megabox",
                            "showTime": "12PM",
                            "bookedSeats": ["A6", "A7"]
                        }, {
                            "_id": "59d8ad68c112793823f8a0a7",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "12PM",
                            "bookedSeats": ["F6", "F7", "D6", "D7", "E6", "E7"]
                        }, {
                            "_id": "59d8b3a8f2c3b53a4db358ff",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "9PM"
                        }];
                        break;
                    case '/api/movies?bookerId=admin':
                        data = [{
                            "_id": "59d8b30bbfb1513a12ae195b",
                            "movieCd": "20171817",
                            "movieNm": "넛잡 2",
                            "theater": "CGV",
                            "showTime": "3PM"
                        }, {
                            "_id": "59d8c7ab2f2e4a414cbe848b",
                            "movieCd": "20174142",
                            "movieNm": "아이 캔 스피크",
                            "theater": "Megabox",
                            "showTime": "12PM",
                            "bookedSeats": ["A6", "A7"]
                        }, {
                            "_id": "59d8ad68c112793823f8a0a7",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "12PM",
                            "bookedSeats": ["F6", "F7", "D6", "D7", "E6", "E7"]
                        }, {
                            "_id": "59d8b3a8f2c3b53a4db358ff",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "9PM"
                        }];
                        break;
                    case '/api/bookingHistory':
                        data = [{
                            "_id": "59d9caa6320d226ef8c961f2",
                            "movieScheduleId": "59d8ad68c112793823f8a0a7",
                            "accountId": "wonju",
                            "overallBookedSeats": ["C6", "C7"],
                            "bookedSeats": ["C6", "C7"],
                            "canceledSeats": [],
                            "timestamp": "2017-10-08T06:50:14.403Z",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "12PM"
                        }, {
                            "_id": "59d9cabe320d226ef8c961f3",
                            "movieScheduleId": "59d8c7ab2f2e4a414cbe848b",
                            "accountId": "wonju",
                            "overallBookedSeats": ["A6", "A7"],
                            "bookedSeats": ["A6", "A7"],
                            "canceledSeats": [],
                            "timestamp": "2017-10-08T06:50:38.625Z",
                            "movieCd": "20174142",
                            "movieNm": "아이 캔 스피크",
                            "theater": "Megabox",
                            "showTime": "12PM"
                        }, {
                            "_id": "59d9cb9620603d6f539481c3",
                            "movieScheduleId": "59d8ad68c112793823f8a0a7",
                            "accountId": "tester",
                            "overallBookedSeats": ["D6", "D7", "E6", "E7"],
                            "bookedSeats": ["D6", "D7", "E6", "E7"],
                            "canceledSeats": [],
                            "timestamp": "2017-10-08T06:54:14.485Z",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "12PM"
                        }, {
                            "_id": "59d9eed0df8a5800046a38c7",
                            "movieScheduleId": "59d8ad68c112793823f8a0a7",
                            "accountId": "wonju",
                            "overallBookedSeats": ["F6", "F7"],
                            "bookedSeats": ["F6", "F7"],
                            "canceledSeats": ["C6", "C7"],
                            "timestamp": "2017-10-08T09:24:32.895Z",
                            "movieCd": "20175222",
                            "movieNm": "킹스맨: 골든 서클",
                            "theater": "CGV",
                            "showTime": "12PM"
                        }];
                        break;
                    case '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=e9b34f61f8fa02867b90eb64c48a855c&targetDt=20171005':
                        data = {
                            "boxOfficeResult": {
                                "boxofficeType": "일별 박스오피스",
                                "showRange": "20171005~20171005",
                                "dailyBoxOfficeList": [{
                                    "rnum": "1",
                                    "rank": "1",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20165450",
                                    "movieNm": "남한산성",
                                    "openDt": "2017-10-03",
                                    "salesAmt": "4940356300",
                                    "salesShare": "39.2",
                                    "salesInten": "284394800",
                                    "salesChange": "6.1",
                                    "salesAcc": "13500775500",
                                    "audiCnt": "599717",
                                    "audiInten": "47010",
                                    "audiChange": "8.5",
                                    "audiAcc": "1625914",
                                    "scrnCnt": "1204",
                                    "showCnt": "5527"
                                }, {
                                    "rnum": "2",
                                    "rank": "2",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20175222",
                                    "movieNm": "킹스맨: 골든 서클",
                                    "openDt": "2017-09-27",
                                    "salesAmt": "2701904100",
                                    "salesShare": "21.5",
                                    "salesInten": "193115500",
                                    "salesChange": "7.7",
                                    "salesAcc": "30175372796",
                                    "audiCnt": "306412",
                                    "audiInten": "25613",
                                    "audiChange": "9.1",
                                    "audiAcc": "3683961",
                                    "scrnCnt": "944",
                                    "showCnt": "4009"
                                }, {
                                    "rnum": "3",
                                    "rank": "3",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20172742",
                                    "movieNm": "범죄도시",
                                    "openDt": "2017-10-03",
                                    "salesAmt": "2305391600",
                                    "salesShare": "18.3",
                                    "salesInten": "567603700",
                                    "salesChange": "32.7",
                                    "salesAcc": "5677580000",
                                    "audiCnt": "277219",
                                    "audiInten": "70761",
                                    "audiChange": "34.3",
                                    "audiAcc": "678497",
                                    "scrnCnt": "871",
                                    "showCnt": "2966"
                                }, {
                                    "rnum": "4",
                                    "rank": "4",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20174142",
                                    "movieNm": "아이 캔 스피크",
                                    "openDt": "2017-09-21",
                                    "salesAmt": "1656787500",
                                    "salesShare": "13.2",
                                    "salesInten": "34229350",
                                    "salesChange": "2.1",
                                    "salesAcc": "18799977864",
                                    "audiCnt": "203371",
                                    "audiInten": "8781",
                                    "audiChange": "4.5",
                                    "audiAcc": "2406164",
                                    "scrnCnt": "805",
                                    "showCnt": "2805"
                                }, {
                                    "rnum": "5",
                                    "rank": "5",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20171817",
                                    "movieNm": "넛잡 2",
                                    "openDt": "2017-10-03",
                                    "salesAmt": "318289200",
                                    "salesShare": "2.5",
                                    "salesInten": "139698100",
                                    "salesChange": "78.2",
                                    "salesAcc": "732813500",
                                    "audiCnt": "41717",
                                    "audiInten": "18995",
                                    "audiChange": "83.6",
                                    "audiAcc": "95732",
                                    "scrnCnt": "453",
                                    "showCnt": "766"
                                }, {
                                    "rnum": "6",
                                    "rank": "6",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20170964",
                                    "movieNm": "딥",
                                    "openDt": "2017-10-03",
                                    "salesAmt": "254461300",
                                    "salesShare": "2.0",
                                    "salesInten": "105013600",
                                    "salesChange": "70.3",
                                    "salesAcc": "622855600",
                                    "audiCnt": "32431",
                                    "audiInten": "13888",
                                    "audiChange": "74.9",
                                    "audiAcc": "78935",
                                    "scrnCnt": "441",
                                    "showCnt": "698"
                                }, {
                                    "rnum": "7",
                                    "rank": "7",
                                    "rankInten": "1",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20172142",
                                    "movieNm": "극장판 요괴워치: 하늘을 나는 고래와 더블세계다냥!",
                                    "openDt": "2017-09-27",
                                    "salesAmt": "89335400",
                                    "salesShare": "0.7",
                                    "salesInten": "40127400",
                                    "salesChange": "81.5",
                                    "salesAcc": "1123728200",
                                    "audiCnt": "11769",
                                    "audiInten": "5532",
                                    "audiChange": "88.7",
                                    "audiAcc": "153837",
                                    "scrnCnt": "198",
                                    "showCnt": "254"
                                }, {
                                    "rnum": "8",
                                    "rank": "8",
                                    "rankInten": "-1",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20171962",
                                    "movieNm": "킬러의 보디가드",
                                    "openDt": "2017-08-30",
                                    "salesAmt": "63333500",
                                    "salesShare": "0.5",
                                    "salesInten": "-414400",
                                    "salesChange": "-0.7",
                                    "salesAcc": "13825874700",
                                    "audiCnt": "10780",
                                    "audiInten": "-80",
                                    "audiChange": "-0.7",
                                    "audiAcc": "1688808",
                                    "scrnCnt": "112",
                                    "showCnt": "181"
                                }, {
                                    "rnum": "9",
                                    "rank": "9",
                                    "rankInten": "0",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20170364",
                                    "movieNm": "레고 닌자고 무비",
                                    "openDt": "2017-09-28",
                                    "salesAmt": "55490100",
                                    "salesShare": "0.4",
                                    "salesInten": "22529900",
                                    "salesChange": "68.4",
                                    "salesAcc": "899876500",
                                    "audiCnt": "7178",
                                    "audiInten": "3043",
                                    "audiChange": "73.6",
                                    "audiAcc": "121578",
                                    "scrnCnt": "143",
                                    "showCnt": "162"
                                }, {
                                    "rnum": "10",
                                    "rank": "10",
                                    "rankInten": "2",
                                    "rankOldAndNew": "OLD",
                                    "movieCd": "20172627",
                                    "movieNm": "리틀 프린세스 소피아 : 신비한 섬",
                                    "openDt": "2017-09-28",
                                    "salesAmt": "31211000",
                                    "salesShare": "0.2",
                                    "salesInten": "13912000",
                                    "salesChange": "80.4",
                                    "salesAcc": "255741000",
                                    "audiCnt": "4287",
                                    "audiInten": "1953",
                                    "audiChange": "83.7",
                                    "audiAcc": "36339",
                                    "scrnCnt": "107",
                                    "showCnt": "174"
                                }]
                            }
                        };
                        break;
                    default:
                        data = [];
                }
        }

        return new Promise((resolve) => {
            resolve(data);
        });
    },

    getYyyymmdd(date) {
        if (!date) {
            date = new Date();
        }

        const mm = date.getMonth() + 1; // getMonth() is zero-based
        const dd = date.getDate();

        return [date.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('');
    }
}

