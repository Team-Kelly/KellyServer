var express = require('express');
var router = express.Router();
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



// /* GET bus */
// router.get('/bus/:buscode', function(req, res, next) {
//
// });


module.exports = router;
