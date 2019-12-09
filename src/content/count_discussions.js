let xhrCountDiscussions = new XMLHttpRequest();
let mergeRequestsCountDiscussion, discussions;
let xhrArrayCountDiscussions = [];
let countDiscussion = [];

function initCountDiscussions() {
    firstCall();
}

function firstCall() {
    xhrCountDiscussions.onreadystatechange = handleFirstCall;
    xhrCountDiscussions.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests?state=opened&per_page=100');
    xhrCountDiscussions.send();
}

function handleFirstCall() {
    if (xhrCountDiscussions.readyState === 4) {
        mergeRequestsCountDiscussion = JSON.parse(xhrCountDiscussions.responseText);
        Object.keys(mergeRequestsCountDiscussion).forEach(key => {
            handelAllMr(key);
        });
    }
}

function handelAllMr(key) {
    xhrArrayCountDiscussions[key] = new XMLHttpRequest();
    xhrArrayCountDiscussions[key].onreadystatechange = function () {
        handleMrCall(key);
    };
    xhrArrayCountDiscussions[key].open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests/' + mergeRequestsCountDiscussion[key].iid + '/discussions?per_page=100');
    xhrArrayCountDiscussions[key].send();
}

function handleMrCall(key) {
    if (xhrArrayCountDiscussions[key].readyState === 4) {
        discussions = JSON.parse(xhrArrayCountDiscussions[key].responseText);
        countDiscussion[key] = {
            'notResolved': 0,
            'total': 0,
        };
        Object.keys(discussions).forEach(discussion => {
            handleDiscussions(key, discussion);
        });
        findAndReplace(mergeRequestsCountDiscussion[key].iid, countDiscussion[key]);
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
    let allIssues = document.getElementsByClassName('issuable-reference');
    for (let key = 0 ; key < allIssues.length ; key++) {
        if (allIssues[key].innerHTML.trim() === '!' + requestId) {
            addHtml(allIssues, count, key);
            break;
        }
    }
}

function addHtml(allIssues, count, key) {
    let container = allIssues[key].closest('.issuable-info-container');
    let discNow = container.getElementsByClassName('issuable-meta')[0];
    discNow.getElementsByClassName('issuable-comments')[0].innerHTML += ' comments';
    discNow.innerHTML += '<div class="merge_request_acyboys"><b>' + count.notResolved + ' </b> discussions not resolved out of <b>' + count.total + '</b></div>';
}