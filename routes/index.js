'use strict';

// Deps
var activity = require('./activity'); // ./activity.js  파일 activity 변수로 사용 가능

/*
 * GET home page.
 */

/*
 app.js의 app.get('/', routes.index) 에 의해 호출됨
 index.html 렌더링
 */
exports.index = function(req, res){
    console.log('index.index ------------------------------------------------');
    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via Salesforce Marketing Cloud',
        });
    } else { // index.html 렌더링. 결과 값: activity의 logExecuteData
        res.render( 'index', {
            title: 'Journey Builder Activity',
            results: activity.logExecuteData, //
        });
    }
};

exports.login = function( req, res ) {
    console.log('index.login ------------------------------------------------');
    console.log( 'req.body: ', req.body );
    res.redirect( '/' );
};

exports.logout = function( req, res ) {
    console.log('index.logout ------------------------------------------------');
    req.session.token = '';
};