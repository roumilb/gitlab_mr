let xhrMyMrProjects = [];
let xhrMyMergeRequests = [];
let infoMyMergeRequest = [];

function initMyMrPage() {
    let mergeRequests = document.querySelectorAll('li.merge-request .merge-request-title-text a');
    if (mergeRequests.length < 1) return true;
    mergeRequestsCountDiscussion = {};
    for (let i = 0 ; i < mergeRequests.length ; i++) {
        //get the mr info
        infoMyMergeRequest[i] = mergeRequests[i].getAttribute('href').split('/').splice(-4);


        xhrMyMrProjects[i] = new XMLHttpRequest();
        xhrMyMrProjects[i].onreadystatechange = function () {
            if (xhrMyMrProjects[i].readyState === 4) {
                projectId = handleProjects(infoMyMergeRequest[i][0], JSON.parse(xhrMyMrProjects[i].responseText));
                if (projectId) {
                    getMergeRequestMyMR(projectId, infoMyMergeRequest[i][3]);
                }
            }
        };
        xhrMyMrProjects[i].open('GET', `${apiUrlBase}/projects?search=${infoMyMergeRequest[i][0]}`);
        xhrMyMrProjects[i].send();
    }
}

function handleProjects(projectName, allProjects) {
    for (let i = 0 ; i < allProjects.length ; i++) {
        if (allProjects[i].path === projectName) return allProjects[i].id;
    }
    return false;
}

function getMergeRequestMyMR(projectID, mrId) {
    xhrMyMergeRequests[`${projectID}-${mrId}`] = new XMLHttpRequest();
    xhrMyMergeRequests[`${projectID}-${mrId}`].onreadystatechange = function () {
        if (xhrMyMergeRequests[`${projectID}-${mrId}`].readyState === 4) {
            let mergeRequest = JSON.parse(xhrMyMergeRequests[`${projectID}-${mrId}`].responseText);
            mergeRequest = mergeRequest[0];

            mergeRequestsCountDiscussion[`${projectID}-${mrId}`] = mergeRequest;
            // mergeRequestsCountDiscussion.push(mergeRequest);
            projectId = projectID;
            handelAllMr(`${projectID}-${mrId}`, projectID);

            getUpvoters(mergeRequest.iid, mergeRequest.author.username === username, mergeRequest.upvotes >= upvotesNeeded, projectID, mergeRequest.id);
        }
    };
    xhrMyMergeRequests[`${projectID}-${mrId}`].open('GET', `${apiUrlBase}/projects/${projectID}/merge_requests?iids[]=${mrId}`);
    xhrMyMergeRequests[`${projectID}-${mrId}`].send();
}
