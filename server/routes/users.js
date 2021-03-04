var express = require('express');
var router = express.Router();

/* GET all user listing. */
router.get('/', function(req, res, next) {
  return res.json(users);
});

/* GET sepecific user */
router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10); //파라미터 중에 id 값을 가져옴
  if(!id){
    //만약 id가 숫자가 아닌 이상한 값이 온다면
    return res.status(400).json({err: 'Wrong ID Value'});
  }

  let user = users.filter(user => user.id === id)[0]; // 결과값 중에 첫번째꺼 가지고 옴
  if(!user){
    //만약 유저를 찾을 수 없으면
    return res.status(404).json({err: 'Unkown user'});
  }

  return res.json(user);
});

let users = [
  {
    id: 1,
    name: 'AAA'
  },
  {
    id: 2,
    name: 'DFG'
  },
  {
    id: 3,
    name: 'HIJ'
  }
]

module.exports = router;
