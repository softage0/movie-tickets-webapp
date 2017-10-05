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

        return fetch(uri, init)
            .then((response) => {
                if (response.ok) {
                    switch (response.status) {
                        case 200:
                            const contentType = response.headers.get('content-type');
                            if (/json/.test(contentType)) {
                                return response.json();
                            } else {
                                return response.blob();
                            }

                        case 204:
                            return;

                        default:
                    }
                } else {
                    console.error(response);
                }
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
