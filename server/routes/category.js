var express = require('express');
var router = express.Router();

require("dotenv").config();

let request = require('request');
let cheerio = require('cheerio');

const { PythonShell } = require("python-shell");


/* GET weather */
router.get('/weather/:location', function(req, res, next) {

    const location = req.params.location;

    let options = {
        scriptPath: "./pyfile/",
        args: [location]
    };

    console.log(options);

    PythonShell.run("naverWeather.py", options, function(err, results) {

        if (err) throw err;

        let text = ""
        let data = results[0].replace(`b\'`, '').replace(`\'`, '');
        let buff = Buffer.from(data, 'base64');
        text = buff.toString('utf-8');

        return res.json(JSON.parse(text));

    });
});


/* GET stock */
router.get('/stock/:tickernumber', function(req, res, next) {

    const tickernumber = req.params.tickernumber;

    let options = {
        scriptPath: "./pyfile/",
        args: [tickernumber]
    };
    console.log(tickernumber);

    PythonShell.run("naverStock.py", options, function(err, results) {

        if (err) throw err;

        let text = ""
        let data = results[0].replace(`b\'`, '').replace(`\'`, '');
        let buff = Buffer.from(data, 'base64');
        text = buff.toString('utf-8');

        return res.json(JSON.parse(text));
    });
});


// 도착 정보 얻어옴
function getArriveData(routeId, arsId, direction) {
    // new Promise() 추가
    return new Promise(function(resolve, reject) {

        var defaultUrl = "http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey="+process.env.OpenAPIKey+"&arsId="+arsId;

        request(defaultUrl, function(err, res, body){
            var $=cheerio.load(body)

            // 각각 버스 도착 정보는 busArrivalList 태그 안에 들어있음
            // 따라서 each문 이용
            $("itemList").each(function(index, bus){
                // bus 변수를 context로 주어서 선택자 이용

                if($('busRouteId', bus).text() == routeId && $('adirection', bus).text() == direction) {
                    arriveResult = "{" + "firstArr : " + $('arrmsg1', bus).text() + ", " +"secondArr : " + $('arrmsg2', bus).text() + "}";
                    resolve(arriveResult);
                }
            })
        })
    });
}

// 버스 routeID, 정류장 고유 번호, 버스 방향 필요
/* GET bus */
router.get('/bus/:busrouteid/:busstoparsid/:direction', function(req, res, next) {

    const busrouteid = req.params.busrouteid;
    const busstoparsid = req.params.busstoparsid;
    const direction = req.params.direction;

    getArriveData(busrouteid, busstoparsid, direction)
        .then(function(arriveResult){
            return res.json(arriveResult);
        })

});

module.exports = router;
