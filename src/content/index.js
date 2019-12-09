let upvotesNeeded = 2;
let apiUrlBase;
let colors = {
    'actions': '#FF2D00',
    'wait': '#FFDC00',
    'done': '#00E90E',
};
let username;

let projectId;
let ifInGitlab = document.getElementById('search_project_id');

if (null !== ifInGitlab && undefined !== ifInGitlab) {
    let currentUrl = window.location.toString();

    chrome.storage.sync.get(['gitlabmr'], function (result) {
        if (undefined !== result.gitlabmr && undefined !== result.gitlabmr.username && '' !== result.gitlabmr.username && undefined !== result.gitlabmr.url && '' !== result.gitlabmr.url) {
            if (currentUrl.indexOf(result.gitlabmr.url) !== -1) {
                username = result.gitlabmr.username;
                apiUrlBase = result.gitlabmr.url[result.gitlabmr.url.length - 1] === '/' ? result.gitlabmr.url : result.gitlabmr.url + '/';
                apiUrlBase += 'api/v4';
                if (result.gitlabmr.colors !== undefined) colors = result.gitlabmr.colors;
                if (result.gitlabmr.upvotes !== undefined && result.gitlabmr.upvotes > 0) upvotesNeeded = result.gitlabmr.upvotes;
                init();
            }
        }
    });
}

function init() {
    projectId = ifInGitlab.value;
    if (undefined === projectId) return false;
    initCountDiscussions();
    initConditionalDisplay();
}
