const xhrGetAllMergeRequests = new XMLHttpRequest();

function getAllMergeRequests(functionHandle) {
    xhrGetAllMergeRequests.onreadystatechange = functionHandle;
    xhrGetAllMergeRequests.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests?state=opened&per_page=100');
    xhrGetAllMergeRequests.send();
}

function handleDiscussionMyMr(id, discussionKey) {
    const discussion = allDiscussions[discussionKey].notes;
    const arrayToReturn = [];

    if (!discussion[0].resolved) {
        arrayToReturn.push('not-resolved');
        if (username !== discussion[discussion.length - 1].author.username) {
            arrayToReturn.push('actions');
        }
    } else {
        arrayToReturn.push('wait');
    }

    return arrayToReturn;
}