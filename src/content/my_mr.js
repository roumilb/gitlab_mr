let xhrMyMrProjects = [];
let xhrMyMergeRequests = [];
let infoMyMergeRequest = [];

function initMyMrPage() {
    let mergeRequests = document.querySelectorAll('li.merge-request .merge-request-title-text a');
    if (mergeRequests.length < 1) return true;
    mergeRequestsCountDiscussion = [];
    for (let i = 0 ; i < mergeRequests.length ; i++) {
        //get the mr info
        infoMyMergeRequest[i] = mergeRequests[i].getAttribute('href').split('/').splice(-3);
        // infoMyMergeRequest[i] = mergeRequests[i].getAttribute('data-id');

        xhrMyMrProjects[i] = new XMLHttpRequest();
        xhrMyMrProjects[i].onreadystatechange = function () {
            if (xhrMyMrProjects[i].readyState === 4) {
                projectId = handleProjects(infoMyMergeRequest[i][0], JSON.parse(xhrMyMrProjects[i].responseText));
                getMergeRequestMyMR(projectId, infoMyMergeRequest[i][2]);
            }
        };
        xhrMyMrProjects[i].open('GET', `${apiUrlBase}/projects?search=${infoMyMergeRequest[i][0]}`);
        xhrMyMrProjects[i].send();
    }
}

function handleProjects(projectName, allProjects) {
    for (let i = 0 ; i < allProjects.length ; i++) {
        if (allProjects[i].name === projectName) return allProjects[i].id;
    }
    return false;
}

function getMergeRequestMyMR(projectID, mrId) {
    xhrMyMergeRequests[mrId] = new XMLHttpRequest();
    xhrMyMergeRequests[mrId].onreadystatechange = function () {
        if (xhrMyMergeRequests[mrId].readyState === 4) {
            let mergeRequest = JSON.parse(xhrMyMergeRequests[mrId].responseText);
            mergeRequest = mergeRequest[0];

            mergeRequestsCountDiscussion.push(mergeRequest);
            handelAllMr(mergeRequestsCountDiscussion.length - 1);

            getUpvoters(mergeRequest.iid, mergeRequest.author.username === username, mergeRequest.upvotes >= upvotesNeeded);
        }
    };
    xhrMyMergeRequests[mrId].open('GET', `${apiUrlBase}/projects/${projectID}/merge_requests?iids[]=${mrId}`);
    xhrMyMergeRequests[mrId].send();
}