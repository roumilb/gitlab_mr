let xhrGetAllMergeRequests = new XMLHttpRequest();

function getAllMergeRequests(functionHandle) {
    xhrGetAllMergeRequests.onreadystatechange = functionHandle;
    xhrGetAllMergeRequests.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests?state=opened&per_page=100');
    xhrGetAllMergeRequests.send();
}

function handleDiscussionMyMr(id, discussionKey) {
    if (!allDiscussions[discussionKey].notes[0].resolved && username !== allDiscussions[discussionKey].notes[allDiscussions[discussionKey].notes.length - 1].author.username) {
        return 'actions';
    } else {
        return 'wait';
    }
}
