# Movie Tickets Booking

Movie Tickets Booking web application using React, Node.js, MongoDB and Express

> 본 프로젝트는 데모용 [Heroku server](https://movie-tickets-booking.herokuapp.com/)에 접근하여 실행 및 테스트를 해볼 수 있다. <br/>
> admin id/password - `admin`/`admin` <br/>
> customer id/password - `tester`/`1234` <br/>
> customer 계정은 `Sign Up` 메뉴에서 추가 가능


## Specification

* React 기반 웹 어플리케이션
* 영화 티켓 예매 사이트 front page
    * 관리자와 사용자 모두 쓸 수 있는 로그인 기반 시스템
    * 관리자
        * id는 `admin`, 이름은 `관리자`로 고정
        * 영화, 상영관, 상영시간 등을 등록, 수정할 수 있음
    * 사용자
        * 시간 및 자리 선택해서 예매
        * 상영관의 자리정보 확인 및 수정, 취소 가능
* 인증처리
    * 로그인 여부
    * 로그인하면 영화 예매 및 과거 예매 이력을 볼 수 있음
    * 로그인 안하면 현재 상영관별, 시간별로 예약된 좌석을 확인만 할 수 있음
    * 세션으로 로그인 처리 - refresh 하더라도 logout 하거나 일정시간이 지나지 않으면 로그인 상태 유지
* 영속성(persistence)처리를 위해 MongoDB 사용
* Node.js/Express로 API 서버 구현


## Requirements

* [Node.js v6.x](https://nodejs.org/)
* Bash shell


## Getting Started - 개발환경

### 저장소 clone 및 npm 패키지 설치

아래 커맨드를 입력하여 저장소를 clone 하고 필요한 모듈을 설치한다.

```shell
$ git clone https://github.com/softage0/movie-tickets-webapp.git
$ cd movie-tickets-webapp
$ npm install
```

### `.env` 생성

외부에 노출되어서는 안되는 정보나 환경 별 설정정보를 관리/사용하기 위하여 `.env` 파일을 생성한다. `.env` 파일은 아래와 같은 정보를 포함하며 소스코드에서 `process.env.{key}`로 접근 가능하다.

```
REACT_APP_KOBIS_KEY={http://www.kobis.or.kr/kobisopenapi/ 발급받은 키}
MONGOLAB_URI={id/password를 포함한 MongoDB 접근 URI}
MONGOLAB_SECRET_KEY={MongoDB unique key - 임의의 문자열로 설정}
PORT={Optional. 서버를 실행할 port. default: 5000. production에서 80으로 설정하면 브라우저에서 접근이 용이하다.}
CI={Optional. 서버에서는 true. true일 경우 `npm test` 명령이 unattended mode로 실행된다.}
```


본 프로젝트는 Front/Back-end가 분리되어 각각 port 5000과 3000번에서 실행되며 개발과정의 편의를 위해 **두 개의 터미널 프로세스**에서 아래 명령으로 각각 실행하는 것을 추천한다.

### Front-end 실행 - React/Webpack
아래 명령으로 `localhost:3000`에 Front-end 코드가 실행되며 `Webpack`으로 watch 한다.
```shell
$ npm start
```

### Back-end 실행 - Node.js/Express/MongoDB
아래 명령으로 `localhost:5000`에 Back-end 코드가 실행되며 `Nodemon`으로 watch 한다.
```shell
$ npm run start:server
```

위와 같이 실행 후 **브라우저에서 `localhost:3000`으로 접근**하면 Front-end 코드에 접근되고 존재하지 않은 요청 시 `localhost:5000`으로 proxy 하므로 `/api`, `/kobisopenapi` 등의 요청은 5000번 포트에서 실행 중인 Node.js 코드에서 처리하게 된다.

> `package.json`에 있는 개발용 proxy 환경 설정
> ```
> "proxy": "http://localhost:5000",
> ```
> 자세한 내용은 [링크](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development) 참조


개발을 진행함에 따라 각각의 터미널에서 로그를 보며 Front-end와 Back-end의 개발상황을 추적할 수 있다.


## Test

개발환경에서 아래의 커맨드로 유닛 테스트를 실행할 수 있다.
```shell
$ npm test
```

CI에 test를 통합할 경우 배포하는 코드의 안정성을 높일 수 있다. 데모용 [Heroku server](https://movie-tickets-booking.herokuapp.com/)에 배포 시 매번 test를 거치도록 설정되어 있다.

CI로 실행할 경우 아래 내용이 **반드시 `.env`에 포함**되어야 한다.
```
CI=true
```

위의 명령이 들어갈 경우 `npm test` 명령이 unattended mode로 실행된다.

> 현재 테스트 실행 시 아래의 Warning 나타난다.
> ```
> Warning: React depends on requestAnimationFrame. Make sure that you load a polyfill in older browsers. http://fb.me/react-polyfills
> ```
> 이것은 이미 알려진 문제이며 React 16.0.1 이후 수정될 예정이다. - [참조 링크](https://github.com/facebookincubator/create-react-app/issues/3199#issuecomment-335015503)


## Deployment

### 배포 원리
Front-end 코드는 아래의 커맨드로 `{project-root}/build`에 빌드된 코드를 생성한다.

```shell
$ npm run build
```

Back-end 코드는 `{project-root}/server.js` 파일 하나로 되어 있으며 아래 내용을 포함하고 있다.

```node
// `/kobisopenapi`로 접근 시 Open API로 proxy
const proxy = require('http-proxy-middleware');
app.use(proxy('/kobisopenapi', {target: 'http://www.kobis.or.kr/'}));

// 선언되지 않은 요청 시 (`/api/*`, `/kobisopenapi`를 제외한 모든 요청) `/build`로 proxy
app.use(express.static(__dirname + '/build'));
```

결과적으로 `{project-root}/build`에 Front-end 코드 생성 후 **아래 커맨드로 Bank-end 서버를 실행**하면 `/api`, `/kobisopenapi`는 각 API 서버를 호출하고 그 외의 Front-end static 코드는 `{project-root}/build`를 호출하게 된다.
```shell
$ node server.js
```

### 배포 방법

아래의 과정을 직접 또는 shell/CI script 등으로 실행한다.

1. 특정 위치에 git clone
1. .env 설정 **(필수 - `npm test`를 실행할 경우 반드시 `CI=true`가 포함되어 있어야한다.)**
1. npm install 실행
1. npm run build 실행
1. npm test 실행 _(optional)_
1. node server.js 실행
1. .env에 설정된 PORT 또는 5000번(default port)에 브라우저로 접근

> 위의 과정은 데모용 [Heroku server](https://movie-tickets-booking.herokuapp.com/)에 적용되어 있으며 [Github](https://github.com/softage0/movie-tickets-webapp.git)에 commit 할 때 마다 자동으로 실행된다.


## References

* 본 프로젝트는 [Create React App](https://github.com/facebookincubator/create-react-app)을 사용해 bootstrapping 하였다.
