let username;
let apiUrlBase;
let tracking = '';
let workWith = '';
let upvotesNeeded = 2;
let colors = {
    actions: '#FF2D00',
    wait: '#FFDC00',
    done: '#00E90E'
};

let projectId;
const isGitlabContext = document.querySelector('.tanuki-logo') !== null;

if (isGitlabContext) {
    const currentUrl = window.location.toString();

    chrome.storage.sync.get(['gitlabmr'], function (result) {
        // No configuration set yet for the extension. Maybe use default values when it is the case?
        if (undefined === result.gitlabmr) {
            return;
        }

        //TODO Maybe remove the configuration fields and always use the connected account with this method?
        if (undefined === result.gitlabmr.username || '' === result.gitlabmr.username || undefined === result.gitlabmr.url || '' === result.gitlabmr.url) {
            const gitlabProfileLink = document.querySelector('[data-track-label="user_profile"]');
            if (gitlabProfileLink) {
                result.gitlabmr.username = gitlabProfileLink.getAttribute('href').split('/').pop();
                result.gitlabmr.url = window.location.origin;
                chrome.storage.sync.set({gitlabmr: result.gitlabmr});
            } else {
                return;
            }
        }

        // Current page doesn't correspond to the Gitlab URL set by the user
        if (currentUrl.indexOf(result.gitlabmr.url) === -1) {
            return;
        }

        username = result.gitlabmr.username;
        apiUrlBase = result.gitlabmr.url[result.gitlabmr.url.length - 1] === '/' ? result.gitlabmr.url : result.gitlabmr.url + '/';
        apiUrlBase += 'api/v4';
        tracking = result.gitlabmr.tracking === undefined ? '' : result.gitlabmr.tracking;
        workWith = result.gitlabmr.working_with === undefined ? 'upvotes' : result.gitlabmr.working_with;
        if (result.gitlabmr.upvotes !== undefined && result.gitlabmr.upvotes > 0) upvotesNeeded = result.gitlabmr.upvotes;
        if (result.gitlabmr.colors !== undefined) colors = result.gitlabmr.colors;

        init(currentUrl);
    });
}

function init(currentUrl) {
    if (currentUrl.indexOf('dashboard') !== -1 || currentUrl.indexOf('groups') !== -1) {
        initMyMrPage();
    } else {
        const body = document.querySelector('body[data-project-id]');
        if (null === body && undefined === body) {
            return;
        }

        projectId = body.dataset.projectId;
        if (undefined === projectId) return false;
        initCountDiscussions();
        initConditionalDisplay();
    }
}
