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


module.exports = router;
