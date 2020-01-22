let xhrGetAllMergeRequests = new XMLHttpRequest();

function getAllMergeRequests(functionHandle) {
    xhrGetAllMergeRequests.onreadystatechange = functionHandle;
    xhrGetAllMergeRequests.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests?state=opened&per_page=100');
    xhrGetAllMergeRequests.send();
}