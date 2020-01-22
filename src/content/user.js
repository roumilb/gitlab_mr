const Api = require('./api').default;
const ChromeHelper = require('./chrome_helper').default;

export default class User
{

    async init() {
        let result = await ChromeHelper.getParamsChrome();
        this.username = result.gitlabmr.username;
        this.id = await this.getId();
    }


    async getId() {
        let userInfo = await Api.call(`/users?username=${this.username}`);
        return userInfo[0].id;
    }
}