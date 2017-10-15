var express = require('express');

var sign = require('../sign.js');
var wechatConfig = require('../wechat.conf.js');
var axios = require('axios')

var router = express.Router();

function getConfig(url, response) {
  let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appId}&secret=${wechatConfig.secret}`
  axios.get(accessTokenUrl).then(res=>{
      let accessToken = res.data.access_token;
      console.log('accessToken:',accessToken)

      let jsapiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
      axios.get(jsapiTicketUrl).then(res=>{
          let jsapi_ticket = res.data.ticket;
          let wxconf = sign(jsapi_ticket, url)
          console.log('wxconfig:',wxconf)

          response.render('index', { wxconf});
      }).catch(error=>{
          console.log(error)
   
          response.render('index', { wxconf});
      })
  }).catch(error=>{
      console.log(error)
    
      response.render('index', { wxconf: {}});
  })
}


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express', signature});
  getConfig("http://face.dbce.cn:7100/", res) 
});

module.exports = router;
