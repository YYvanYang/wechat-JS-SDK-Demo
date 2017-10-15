import 'babel-polyfill'
const Promise = require('bluebird')
const axios   = require('axios');
import NodeCache from 'node-cache'
var wechatConf = require('./wechat.conf.js');
var sign = require('./sign.js');

const accessTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`
const jsapiTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`


export default class Wechat {
  constructor(config = {}) {
    this.cacheExpiresInSeconds = config.cacheExpiresInSeconds || 7200
    this.cache = new NodeCache()
  }

  getAccessTokenRequest = () => {
    return axios.request({
      url: accessTokenUrl,
      params: {
        ...wechatConf
      }
    });
  }

  getJsapiTicketRequest = (accessToken) => {
    return axios.request({
      url: jsapiTicketUrl,
      params: {
        accessToken
      }
    });
  }

  async getTicket() {
    const accessToken = await this.getAccessTokenRequest();
    console.log("accessToken:", accessToken);
    const ticket = await this.getJsapiTicketRequest(accessToken);
    console.log("ticket:",ticket);

    return ticket
  }

  async sign(url) {
    const jsapi_ticket = await this.getTicket()
    const ticket = jsapi_ticket.ticket
    return sign(ticket, url)
  }
}