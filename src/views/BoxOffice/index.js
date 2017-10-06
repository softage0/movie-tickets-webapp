import React, {Component} from 'react';

import utils from '../../utils';


export class BoxOffice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boxOfficeList: [],
        }
    }

    componentDidMount() {
        utils.fetch(
            'get',
            '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json',
            {
                key: process.env.REACT_APP_KOBIS_KEY,
                targetDt: '20171005' || utils.getYyyymmdd(),
            },
        ).then(function (response) {
            console.log(response);
        })
    }

    render() {
        return (
            <div>
                <h1>Box Office Status</h1>
                <p>Please select one of the above functions you want to use.</p>
            </div>
        )
    }
}

export default BoxOffice;
