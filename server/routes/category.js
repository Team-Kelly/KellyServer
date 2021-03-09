var express = require('express');
var router = express.Router();
const { PythonShell } = require("python-shell");

/* GET weather */
router.get('/weather', function(req, res, next) {

    PythonShell.run("naverWeather.py", options, function(err, results) {
        if (err) throw err;

        let text = ""
        let data = results[0].replace(`b\'`, '').replace(`\'`, '');
        let buff = Buffer.from(data, 'base64');
        text = buff.toString('utf-8');

        return res.json(JSON.parse(text));

    });
});

let options = {
    scriptPath: "./pyfile/",
    args: ["노원구"]
};


module.exports = router;
