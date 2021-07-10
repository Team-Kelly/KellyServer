var axios = require("axios");
var express = require('express');
var router = express.Router();

let request = require('request');
let cheerio = require('cheerio');
require('dotenv').config({ path: "../.env" });

const { PythonShell } = require("python-shell");

async function getPythonResult(pyname, options){
    return new Promise(resolve =>{
        PythonShell.run(pyname, options, function(err, results) {

            if (err) throw err;

            let text = ""
            let data = results[0].replace(`b\'`, '').replace(`\'`, '');
            let buff = Buffer.from(data, 'base64');
            text = buff.toString('utf-8');

            console.log(text)
            resolve(text);

        });
    })
}

/* GET weather */
router.get('/weather/:location', function(req, res, next) {

    const location = req.params.location;

    let options = {
        scriptPath: "./pyfile/",
        args: [location]
    };

    getPythonResult("naverWeather.py", options)
        .then(function(result){
            return res.json(result)
        });
});


/* GET stock */
router.get('/stock/:tickernumber', function(req, res, next) {

    const tickernumber = req.params.tickernumber;

    let options = {
        scriptPath: "./pyfile/",
        args: [tickernumber]
    };

    getPythonResult("naverStock.py", options)
        .then(function(result){
            return res.json(result)
        });

});


/* GET coin */
router.get('/coin/:symbol', function(req, res, next) {

    let symbol = req.params.symbol;

    axios.get('https://api.bithumb.com/public/ticker/'+symbol)
        .then(function (response) {
            return res.json(response.data);
        })
        .catch(function (error) {
            return res.json("cannot load bithumb data");
        })



});

//버스 도착 정보 얻어옴
router.get('/bus/:arsid/:busid', function(req, res, next) {

    const arsid = req.params.arsid; //버스 정류장 번호
    const busid = req.params.busid; //타겟 버스 번호

    let options = {
        scriptPath: "./pyfile/",
        args: [arsid, busid]
    };

    getPythonResult("busArrive.py", options)
        .then(function(result){
            return res.json(result)
        });

});

// 도착 정보 얻어옴
// function getArriveData(routeId, arsId, direction) {
//     // new Promise() 추가
//     return new Promise(function(resolve, reject) {
//
//         var defaultUrl = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey="+process.env.OpenAPIKey+"&arsId="+arsId;
//
//
//         console.log(defaultUrl);
//
//         request(defaultUrl, function(err, res, body){
//             var $=cheerio.load(body)
//
//             // 각각 버스 도착 정보는 busArrivalList 태그 안에 들어있음
//             // 따라서 each문 이용
//             $("itemList").each(function(index, bus){
//                 // bus 변수를 context로 주어서 선택자 이용
//
//                 if($('busRouteId', bus).text() == routeId && $('adirection', bus).text() == direction) {
//                     arriveResult = {"firstArr" : $('arrmsg1', bus).text(), "secondArr" : $('arrmsg2', bus).text()};
//                     resolve(arriveResult);
//                 }
//             })
//         })
//     });
// }

// 버스 routeID, 정류장 고유 번호, 버스 방향 필요
/* GET bus */
// router.get('/bus/:busrouteid/:busstoparsid/:direction', function(req, res, next) {
//
//     const busrouteid = req.params.busrouteid; //노선
//     const busstoparsid = req.params.busstoparsid; //버스 고유 정거장
//     const direction = req.params.direction; //방향
//
//
//     getArriveData(busrouteid, busstoparsid, direction)
//         .then(function(arriveResult){
//             return res.json(arriveResult);
//         })
//
// });

module.exports = router;