'use strict';
// Module Dependencies
// -------------------

/*
express : nodejs 서버 프레임워크
body-parser : nodejs 모듈로 POST request data의 body로부터 파라미터 추출
errorhandler : express의 오류처리 함수
request : HTTP call을 담당해주는 모듈
*/

var express     = require('express'); 
var bodyParser  = require('body-parser'); 
var errorhandler = require('errorhandler'); 
var http        = require('http');
var path        = require('path');
var request     = require('request'); 
var routes      = require('./routes'); // ./routes 경로 routes 변수로 사용 가능
var activity    = require('./routes/activity'); // ./routes/activity.js 파일 activity 변수로 사용 가능
var url=require('url');

require('request').debug = true; // request 사용시 디버깅 허용

console.log('H02');

/*라우팅 시작 ------------------------*/
var app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);

//POST시 jwt 타입으로 body값 가져옴
app.use(bodyParser.raw({type: 'application/jwt'}));
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.methodOverride());
//app.use(express.favicon());

// static 파일(ex.css파일) 사용
app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
// 개발자 모드에서 errorhandler 함수 사용 (production mode등 여러 모드 존재)
if ('development' == app.get('env')) {
  app.use(errorhandler());
}


console.log('INFLOW START ------------------------------------------------------------------------------');

//모든 request 시 'PORT : 포트번호' 출력
app.use((req, res, next) => {
  //console.log('%s', req);
  console.log('PORT: '+req.PORT);
  next();
 });

 console.log('INFLOW END ------------------------------------------------------------------------------');


 // HubExchange Routes
app.get('/', routes.index ); // https://twilio-suhee.herokuapp.com/ -> ./routes/index.js 안의 index 함수 호출
app.post('/login', routes.login ); //안쓰임
app.post('/logout', routes.logout ); //안쓰임

// Custom Hello World Activity Routes
// https://twilio-suhee.herokuapp.com/journeybuilder/0000 -> activity.js 파일 내의 해당 함수 호출
app.post('/journeybuilder/save/', activity.save );
app.post('/journeybuilder/validate/', activity.validate );
app.post('/journeybuilder/publish/', activity.publish );
app.post('/journeybuilder/execute/', activity.execute );

//app.post('/journeybuilder/execute/', console.log('HERE99') );

//express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));


  app.use((req, res, next) => {
    var pathname=url.parse(req.url).pathname;
    console.log('Pathname: '+pathname);
  /*
    switch(pathname){
        case '/routes/activity.js':
            res.end('activity');
        break;
        case '/public/js/customActivity.js':
            res.end('customActivity');
        break;
        case '/journeybuilder/save/':
            res.end('/journeybuilder/save/');
        break;
        default:
            res.end('default');
        break;
    }
*/    
      next();
   });
});



/*
const { Pool, Client } = require('pg');

const pool = new Pool({
    host: 'ec2-52-203-74-38.compute-1.amazonaws.com',
    user: 'wgjgqytdjizusr',
    password: 'ff8d9ae7ac3c1a64f3a1a2654cf134a708d57c79400b7c420f9dfa39ff24f6c8',  
    database: 'd841858886d6en',
    port: 5432,
    ssl: { rejectUnauthorized: false },
});
*/
/*
pool.query('INSERT INTO mms_list VALUES( $1, $2, $3)', ['10','999','MMM'], (err, res) => {
    console.log(res); // Hello World!
    pool.end();
  });
*/

/*
var server=http.createServer(function(req,res){
    var pathname=url.parse(req.url).pathname;
    switch(pathname){
        case '/routes/activity.js':
            res.end('activity');
        break;
        case '/public/js/customActivity.js':
            res.end('customActivity');
        break;
        default:
            res.end('default');
        break;
    }

}).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/
