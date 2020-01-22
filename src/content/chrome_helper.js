export default class ChromeHelper
{
    static paramsOK(result) {
        let currentUrl = window.location.toString();
        if (undefined !== result.gitlabmr && undefined !== result.gitlabmr.username && '' !== result.gitlabmr.username && undefined !== result.gitlabmr.url && '' !== result.gitlabmr.url && currentUrl.indexOf(result.gitlabmr.url) !== -1) {
            return true;
        } else {
            console.error('Params missing for gitlab MR tools');
            return false;
        }
    }

    static async getParamsChrome() {
        return await chrome.storage.sync.get(['gitlabmr']);
    }
}