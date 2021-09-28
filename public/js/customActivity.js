define([
    /* postmonger : frontend용 javascript 라이브러리 */
    'postmonger'
], function(
    Postmonger
) {
    'use strict';
    
    /* Session 시작 */
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key; // currentStep = "step1"

    // HTML 브라우저 실행
    $(window).ready(onRender);

    
    //이벤트와 함수 바인딩---------------------------
    /*
    initActivity 이벤트 - initialize() 함수 
    requestTokens 이벤트 - onGetTokens() 함수
    requestEndpoints 이벤트 - onGetEndpoints() 함수
    clickedNext 이벤트 - save() 함수
    */
    connection.on('initActivity', initialize); // payload 데이터 초기화
    connection.on('requestedTokens', onGetTokens);  // 토큰 리턴
    connection.on('requestedEndpoints', onGetEndpoints);  // REST host URL값 리턴
    connection.on('clickedNext', save); // next 버튼 클릭시 데이터 저장
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    
    //event 발생 할때마다 Entry Source의 값 가져옴
    var eventDefinitionKey;
    connection.trigger('requestTriggerEventDefinition');

    connection.on('requestedTriggerEventDefinition',
    function(eventDefinitionModel) {
        if(eventDefinitionModel){

            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            console.log("[] Event Definition Key: " + eventDefinitionKey);
            /*If you want to see all*/
            console.log('[] Request Trigger',JSON.stringify(eventDefinitionModel));
        }

    });
    //-----------------------------------------------

    // Session 시작시 실행.
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }
  
  // initActivity 이벤트 시 실행. data 초기화 함수
    function initialize(data) {
        // JSON.stringify 함수 : JSON 객체를 String 객체로 변환
        console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    
        
        /* Data 초기화 */
        // payload에 데이터 존재 o -> hasInArguments는 1
        // payload에 데이터 존재 x -> hasInArguments는 0
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );
       
        // hasInArguments가 0 -> inArguments = payload['arguments'].execute.inArguments
        // hasInArguments가 1 -> inArguments = {}
        // 즉, inArguments = {}
        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
        
        
        console.log('Has In arguments: '+JSON.stringify(inArguments));
        
        // inArguments 에 index.html 페이지에서 받아온 값 전달
        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'accountSid') {
                    $('#accountSID').val(val);
                }

                if (key === 'authToken') {
                    $('#authToken').val(val);
                }

                if (key === 'messagingService') {
                    $('#messagingService').val(val);
                }

                if (key === 'body') {
                    $('#messageBody').val(val);
                }                                                               

            })
        });
        
        // clickedNext 이벤트 실행시 
        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }
    
    // leagacy와 fuel2token 토큰 리턴. requestTokens 이벤트 시 실행
    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }
    
    // REST host URL값 리턴. requestEndpoints 이벤트 시 실행
    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }
   
    // data 값 저장
    function save() {

        var accountSid = $('#accountSID').val();
        var authToken = $('#authToken').val();
        var messagingService = $('#messagingService').val();
        var body = $('#messageBody').val();

        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            "messagingService": messagingService,
            "body" : body,
            "name" : "{{Event."+eventDefinitionKey+".Name}}", 
            "phone": "{{Event."+eventDefinitionKey+".Phone}}"
        }];

        payload['metaData'].isConfigured = true; // metadata 값 항상 true로 설정

        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        
        // activity 종료 후 payload에 데이터 저장
        connection.trigger('updateActivity', payload);

    }                    

});