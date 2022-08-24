const xhrGetAllMergeRequests = new XMLHttpRequest();

function getAllMergeRequests(functionHandle) {
    xhrGetAllMergeRequests.onreadystatechange = functionHandle;
    xhrGetAllMergeRequests.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests?state=opened&per_page=100');
    xhrGetAllMergeRequests.send();
}

function handleDiscussionMyMr(id, discussionKey) {
    const discussion = allDiscussions[discussionKey].notes;

    if (!discussion[0].resolved || username !== discussion[discussion.length - 1].author.username) {
        return 'actions';
    } else {
        return 'wait';
    }
}