'use strict';

var util = require('util');

// Deps
/*
path : 파일과 directory 경로 작업을 위한 utility 제공 모듈
*/
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js')); //jwtDecoder.js 파일 JWT 변수로 사용 가능
var http = require('https');

//log data 를 담을 logExecuteData 배열 생성
exports.logExecuteData = [];

// logExecuteData에 log data 저장 후 출력
function logData(req) {
    exports.logExecuteData.push({
        body: req.body, 
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path, 
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("Edit");	
    
    // Data from the req and put it in an array accessible to the main app.

    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
// app.js의 app.post('/journeybuilder/save/', activity.save ) 호출 후 실행되는 함수
exports.save = function (req, res) {
    
    console.log("Save");	
    
    // Data from the req and put it in an array accessible to the main app.
    
    // log data 저장 후 출력
    logData(req); 
    // 응답 메세지 전송. res.send(status, body)
    res.send(200, 'Save'); 
};

/*
 * POST Handler for /execute/ route of Activity.
 */
// app.js의 app.post('/journeybuilder/execute/', activity.execute ) 호출 후 실행되는 함수
exports.execute = function (req, res) {

    console.log("Execute");	
    console.log("==============b4Decode========================");
    console.log(req.body);
    console.log("==============b4Decode Done===================");

    // reqest의 body decoding....
     JWT(req.body, process.env.jwtSecret, (err, decoded) => {

         // verification error -> unauthorized request
         // 에러 발생시 처리
         if (err) {
             console.error(err);
             return res.status(401).end();
         }


         if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
             // 디코딩 완료된 request body 값 출력
             var decodedArgs = decoded.inArguments[0];
             console.log("Executed: ----------------------------------------------------------------------------");
             console.log("Executed: ",decodedArgs);
             console.log("Executed: ----------------------------------------------------------------------------");
         
             //logData(req);
             
             // 응답 메세지 전송. res.send(status, body)
             res.send(200, 'Execute');
         } else {
             console.error('inArguments invalid.');
             return res.status(400).end();
         }
     });

};


/*
 * POST Handler for /publish/ route of Activity.
 */
//app.js의 app.post('/journeybuilder/publish/', activity.publish ) 호출 후 실행되는 함수
exports.publish = function (req, res) {

    console.log("Publish");	
    
    // Data from the req and put it in an array accessible to the main app.
    // log data 저장 후 출력
    logData(req);
    // 응답 메세지 전송. res.send(status, body)
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
// app.js의 app.post('/journeybuilder/validate/', activity.validate ) 호출 후 실행되는 함수
exports.validate = function (req, res) {

    console.log("Validate");	
    
    // Data from the req and put it in an array accessible to the main app.
    // log data 저장 후 출력
    logData(req);
    // 응답 메세지 전송. res.send(status, body)
    res.send(200, 'Validate');
};

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


pool.query('INSERT INTO mms_list VALUES( $1, $2, $3)', ['10','999','MMM'], (err, res) => {
    console.log(res); // Hello World!
    pool.end();
  });
  */