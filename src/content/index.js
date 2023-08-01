let upvotesNeeded = 2;
let colors = {
    'actions': '#FF2D00',
    'wait': '#FFDC00',
    'done': '#00E90E'
};
let apiUrlBase;
let username;
let tracking = '';
let workWith = '';

let projectId;
const ifInGitlab = document.querySelector('.tanuki-logo');

if (null !== ifInGitlab && undefined !== ifInGitlab) {
    const currentUrl = window.location.toString();

    chrome.storage.sync.get(['gitlabmr'], function (result) {
        if (undefined
            !== result.gitlabmr
            && undefined
            !== result.gitlabmr.username
            && ''
            !== result.gitlabmr.username
            && undefined
            !== result.gitlabmr.url
            && ''
            !== result.gitlabmr.url) {
            if (currentUrl.indexOf(result.gitlabmr.url) !== -1) {
                username = result.gitlabmr.username;
                apiUrlBase = result.gitlabmr.url[result.gitlabmr.url.length - 1] === '/' ? result.gitlabmr.url : result.gitlabmr.url + '/';
                apiUrlBase += 'api/v4';
                tracking = result.gitlabmr.tracking === undefined ? '' : result.gitlabmr.tracking;
                workWith = result.gitlabmr.working_with === undefined ? 'upvotes' : result.gitlabmr.working_with;
                if (result.gitlabmr.colors !== undefined) colors = result.gitlabmr.colors;
                if (result.gitlabmr.upvotes !== undefined && result.gitlabmr.upvotes > 0) upvotesNeeded = result.gitlabmr.upvotes;
                init(currentUrl);
            }
        }
    });
}

function init(currentUrl) {
    if (currentUrl.indexOf('dashboard') !== -1 || currentUrl.indexOf('groups') !== -1) {
        initMyMrPage();
    } else {
        const projectIdInput = document.getElementById('project_id');
        if (null === projectIdInput && undefined === projectIdInput) {
            return;
        }
        projectId = projectIdInput.value;
        if (undefined === projectId) return false;
        initCountDiscussions();
        initConditionalDisplay();
    }
}
