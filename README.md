# Movie Tickets Booking

Movie Tickets Booking web application project using ReactJS, Redux and Webpack

본 프로젝트는 이 [Heroku server](https://movie-tickets-booking.herokuapp.com/)에 접근하여 실행 및 테스트를 해볼 수 있다.


## Requirements

* [Node.js v6.x](https://nodejs.org/)
* Bash shell


## Getting Started - 개발환경

아래 커맨드를 입력하여 저장소를 clone 하고 필요한 모듈을 설치한다.

```shell
$ git clone https://github.com/softage0/algorithm-trading-webapp.git
$ cd algorithm-trading-webapp
$ npm install                   # Install Node modules listed in ./package.json (may take a while the first time)
```

환경 별 설정정보를 관리/사용하기 위하여 `.env` 파일을 생성한다. `.env` 파일은 아래와 같은 정보를 포함한다.

```
REACT_APP_KOBIS_KEY={http://www.kobis.or.kr/kobisopenapi/ 발급받은 키}
MONGOLAB_URI={id/password를 포함한 MongoDB 접근 URI}
MONGOLAB_SECRET_KEY={MongoDB unique key - 임의의 문자열로 설정}
PORT={서버를 실행할 port. default: 5000. production에서는 80으로 설정하면 브라우저에서 접근이 용이하다.}
```


본 프로젝트는 Front/Back-end가 분리되어 각각 port 5000과 3000번에서 실행되며 개발과정의 편의를 위해 `두 개의 터미널 프로세스`에서 아래 명령으로 각각 실행하는 것을 추천한다.

### Front-end - React/Webpack
아래 명령으로 `localhost:3000`에 Front-end 코드가 실행되며 Webpack으로 watch 한다.
```shell
$ npm start
```

### Back-end - Node.js/MongoDB
아래 명령으로 `localhost:5000`에 Back-end 코드가 실행되며 Nodemon으로 watch 한다.
```shell
$ npm run start:server
```

위와 같이 실행 후 브라우저에서 `localhost:3000`으로 접근하면 Front-end 코드에 접근되고 존재하지 않은 요청 시 `localhost:5000`으로 proxy 하므로 `/api`, `/kobisopenapi` 등의 요청은 5000번 포트에서 실행 중인 Node.js 코드에서 처리하게 된다.

> `package.json`에 있는 개발용 proxy 환경 설정
> ```
> "proxy": "http://localhost:5000",
> ```
> 자세한 내용은 [링크](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development) 참조


개발을 진행함에 따라 각각의 터미널에서 로그를 보며 개발상황을 추적할 수 있다.


## Deployment

### 배포 원리
Front-end 코드는 아래의 커맨드로 `{project-root}/build`에 빌드된 코드를 생성한다.

```shell
$ npm run build
```

Back-end 코드는 `{project-root}/server.js` 파일 하나로 되어 있으며 아래 내용을 포함하고 있다.

```nodejs
// `/kobisopenapi`로 접근 시 Open API로 proxy
const proxy = require('http-proxy-middleware');
app.use(proxy('/kobisopenapi', {target: 'http://www.kobis.or.kr/'}));

// 선언되지 않은 요청 시 (`/api/*`, `/kobisopenapi`를 제외한 모든 요청) `/build`로 proxy
app.use(express.static(__dirname + '/build'));
```shell
$ node server.js
```

결과적으로 `{project-root}/build`에 Front-end 코드 생성 후 아래 커맨드로 Bank-end 서버를 실행하면 `/api`, `/kobisopenapi`는 API를 호출하고 그 외의 Front-end static 코드는 `{project-root}/build` 하게 된다.

### 배포 방법

아래의 과정을 직접 또는 shell/CI script 등으로 실행한다.

1. 특정 위치에 git clone
1. .env 설정
1. npm install 실행
1. npm run build 실행
1. node server.js 실행
1. .env에 설정된 PORT 또는 5000번(default port)에 브라우저로 접근

> 위의 과정은 [Heroku server](https://movie-tickets-booking.herokuapp.com/)에 적용되어 있으며 [Github](https://github.com/softage0/algorithm-trading-webapp.git)에 commit 할 때 마다 자동으로 실행된다.


## References

* 본 프로젝트는 [Create React App](https://github.com/facebookincubator/create-react-app)를 사용해 bootstrapping 하였다.
