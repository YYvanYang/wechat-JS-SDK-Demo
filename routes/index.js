var express = require('express');

var sign = require('../sign.js');
var wechatConfig = require('../wechat.conf.js');
var axios = require('axios')

var router = express.Router();

var tokenExpiresInSeconds = 7200

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

function getConfig(url, response) {

  getAccessToken().then(at=>{
    console.log('22222 access token: ', at)

    getTicket(at).then(tt=>{
      console.log('333 Ticket: ', tt)

      let wxconf = sign(tt, url)
      console.log('wxconfig:',wxconf)
      response.render('index', { wxconf});
    }).catch(
      // Log the rejection reason
     (reason) => {
          console.log('Handle rejected promise ('+reason+') here.');
          response.render('index', { wxconf:{}});
      });
  }).catch(
    // Log the rejection reason
   (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        response.render('index', { wxconf:{}});
    });
  
}

function getAccessToken() {
  return new Promise((resolve, reject) => {
    let cacheAccessToken = cache.get("access_token")
    if (cacheAccessToken) {
      console.log('cacheAccessToken: ',cacheAccessToken)
      resolve(cacheAccessToken)
      return
    }

    let accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wechatConfig.appId}&secret=${wechatConfig.secret}`
    axios.get(accessTokenUrl).then(res=>{
        let accessToken = res.data.access_token;
        console.log('accessToken:',accessToken)
        if (accessToken) {
          cache.set('access_token', accessToken, tokenExpiresInSeconds)
          resolve(accessToken)
        } else {
          reject(res.data)
        }
        
    }).catch(error=>{
        console.log(error)
      
        reject(error)
    })

  });
}


function getTicket(accessToken) {
  return new Promise((resolve, reject) => {
    let cachejsapi_ticket = cache.get("jsapi_ticket")
    if (cachejsapi_ticket) {
      console.log('cachejsapi_ticket: ',cachejsapi_ticket)
      resolve(cachejsapi_ticket)
      return
    }

    let jsapiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
    axios.get(jsapiTicketUrl).then(res=>{
        let jsapi_ticket = res.data.ticket;
        if (jsapi_ticket) {
          cache.set('jsapi_ticket', jsapi_ticket, tokenExpiresInSeconds)
          resolve(jsapi_ticket)
        } else {
          reject(res.data)
        }
        
    }).catch(error=>{
        console.log(error)

        reject(error)
    })

  });
}



/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express', signature});
  getConfig("http://TODOIP:7100/", res) 
});

module.exports = router;
