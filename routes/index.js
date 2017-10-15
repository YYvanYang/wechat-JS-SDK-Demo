var express = require('express');

import Wechat from '../wechat'

var wechat = new Wechat()

var router = express.Router();

function getConfig(url, response) {
  const wxconf = await wechat.sign(url)
  response.render('index', { wxconf });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express', signature});
  getConfig("http://face.dbce.cn:7100/", res) 
});

module.exports = router;
