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

