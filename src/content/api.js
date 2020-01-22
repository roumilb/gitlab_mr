const axios = require('axios').default;
const ChromeHelper = require('./chrome_helper').default;

export default class Api
{
    static async call(url) {
        let result = await ChromeHelper.getParamsChrome();
        let baseUrl = result.gitlabmr.url[result.gitlabmr.url.length - 1] === '/' ? result.gitlabmr.url : result.gitlabmr.url + '/';
        baseUrl += 'api/v4';
        let resultCall = await axios.get(`${baseUrl}${url}`);
        return resultCall.data;
    }
}