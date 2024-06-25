const xhrCountDiscussions = new XMLHttpRequest();
let mergeRequestsCountDiscussion, discussions;
const xhrArrayCountDiscussions = [];
const countDiscussion = [];

function initCountDiscussions() {
    firstCall();
}

function firstCall() {
    xhrCountDiscussions.onreadystatechange = handleFirstCall;
    xhrCountDiscussions.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests?state=opened&per_page=100');
    xhrCountDiscussions.send();
}

function handleFirstCall() {
    if (xhrCountDiscussions.readyState === 4 && xhrCountDiscussions.status >= 200 && xhrCountDiscussions.status <= 299) {
        mergeRequestsCountDiscussion = JSON.parse(xhrCountDiscussions.responseText);
        Object.keys(mergeRequestsCountDiscussion).forEach(key => {
            handelAllMr(key);
        });
    }
}

function handelAllMr(key, projectID) {
    if (undefined === projectID) projectID = projectId;
    xhrArrayCountDiscussions[key] = new XMLHttpRequest();
    xhrArrayCountDiscussions[key].onreadystatechange = function () {
        handleMrCall(key);
    };
    xhrArrayCountDiscussions[key].open('GET',
        `${apiUrlBase}/projects/${projectID}/merge_requests/${mergeRequestsCountDiscussion[key].iid}/discussions?per_page=100`
    );
    xhrArrayCountDiscussions[key].send();
}

function handleMrCall(key) {
    if (xhrArrayCountDiscussions[key].readyState === 4) {
        discussions = JSON.parse(xhrArrayCountDiscussions[key].responseText);
        countDiscussion[key] = {
            'notResolved': 0,
            'total': 0
        };
        Object.keys(discussions).forEach(discussion => {
            handleDiscussions(key, discussion);
        });
        findAndReplace(mergeRequestsCountDiscussion[key].id, countDiscussion[key]);
    }
}

function handleDiscussions(key, discussion) {
    if (discussions[discussion].notes[0].resolvable) {
        if (!discussions[discussion].notes[0].resolved) {
            countDiscussion[key].notResolved++;
        }
        countDiscussion[key].total++;
    }
}

function findAndReplace(requestId, count) {
    const mergeRequest = document.getElementById(`merge_request_${requestId}`);
    if (!mergeRequest) return;
    const issue = mergeRequest.getElementsByClassName('issuable-info-container')[0];
    mergeRequest.setAttribute('style', 'display: flex; padding-bottom: 5px!important');
    if (issue === null) return;
    count.resolved = count.total >= count.notResolved ? count.total - count.notResolved : 0;
    addHtml(issue, count);
}

function addHtml(container, count) {
    const comments = container.querySelector('[data-testid="issuable-comments"]');
    if (!comments) return;
    comments.innerHTML += ' comments';
    comments.parentElement.innerHTML += `<div class="merge_request_acyboys">Discussions resolved: ${count.resolved}/${count.total}</div>`;
}
