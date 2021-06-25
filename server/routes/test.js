var express = require('express');
var router = express.Router();
var {google} = require('googleapis');
var cron = require('node-cron');
var admin = require("firebase-admin");
require('dotenv').config({ path: "./.env" });

const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/admin.directory.group'
]
var serviceAccount = require(process.env.jwtAuth_PATH);

let simpleDB = [];

//////////////////////////////// FB 초기화 /////////////////////////////////

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


function getAccessToken() { //JWT 엑세스 토큰 받아옴
  return new Promise(function(resolve, reject) {
    const key = require(process.env.jwtAuth_PATH);
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        scopes,
        null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

//////////////////////////////// node-cron /////////////////////////////////

// 매 분마다 콘솔 찍음
cron.schedule('* * * * *', function(){

  var nowDate = new Date();
  let curTime = String(nowDate.getHours()+9) + ":" + String(nowDate.getMinutes());

  console.log("currentTime", curTime);

  for (var idx = 0; idx < simpleDB.length; idx++){
    if (simpleDB[idx].timer === curTime){
      console.log("alarmTargetToken", simpleDB[idx]);


      simpleDB.splice(idx, 1);
      console.log(simpleDB);

//       getAccessToken().then(function(resolvedData) {
//         var registrationToken = simpleDB[idx].appToken;
//         console.log("registeration", registrationToken);
//
// // This registration token comes from the client FCM SDKs.
//
//         simpleDB.splice(idx, 1);
//         console.log(simpleDB);
//
//         var message = {
//           notification: {
//             "title": "kelly notification",
//             "body": "캘리 알람 테스트중입니다"
//           },
//           token: registrationToken
//         };
//
// // Send a message to the device corresponding to the provided
// // registration token.
//         admin.messaging().send(message)
//             .then((response) => {
//               // Response is a message ID string.
//               console.log('Successfully sent message:', response);
//             })
//             .catch((error) => {
//               console.log('Error sending message:', error);
//             });
//         })
    }
  }
});


router.post('/', function(req, res, next) {

  console.log(req.body.timer);
  console.log(req.body.appToken);

  simpleDB.push({timer: req.body.timer, appToken: req.body.appToken});

  console.log(simpleDB);
  return res.json(req.body);

});

// router.get('/api', function(req, res, next) {
//
//   getAccessToken().then(function(resolvedData) {
//     var registrationToken = "token";
//     console.log("registeration", registrationToken);
//
//
// // This registration token comes from the client FCM SDKs.
//
//     var message = {
//       notification:{
//         "title":"Portugal vs. Denmark",
//         "body":"great match!"
//       },
//       token: registrationToken
//     };
//
// // Send a message to the device corresponding to the provided
// // registration token.
//     admin.messaging().send(message)
//         .then((response) => {
//           // Response is a message ID string.
//           console.log('Successfully sent message:', response);
//         })
//         .catch((error) => {
//           console.log('Error sending message:', error);
//         });
//
//     return res.json("success");
//   });
//
// });


module.exports = router;
