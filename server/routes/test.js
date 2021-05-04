var express = require('express');
var router = express.Router();

/* GET test listing. */
router.post('/', function(req, res, next) {
  console.log(req.body.timer);
  console.log(req.body.appToken);
  return res.json(req.body);
});


module.exports = router;
