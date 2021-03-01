var express = require('express');
var router = express.Router();

/* GET main page. */
router.get('/', function(req, res, next) {
    res.render('main', { title: 'this is main' });
});

module.exports = router;
