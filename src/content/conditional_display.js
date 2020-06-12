let mergeRequestStatus = {}, mrCondDisplay, xhrCondDisplay = [], allDiscussions, xhrUpvoters = [], myUpvotes = {};

function initConditionalDisplay() {
    getAllMergeRequests(sortMergeRequest);
}

function sortMergeRequest() {
    if (xhrGetAllMergeRequests.readyState === 4) {
        mrCondDisplay = JSON.parse(xhrGetAllMergeRequests.responseText);
        Object.keys(mrCondDisplay).forEach(key => {
            getUpvoters(mrCondDisplay[key].iid, mrCondDisplay[key].author.username === username, mrCondDisplay[key].upvotes >= upvotesNeeded);
        });
    }
}

function displayStatusMr(id) {
    let allIssues = document.getElementsByClassName('issuable-reference');
    for (let key = 0 ; key < allIssues.length ; key++) {
        if (allIssues[key].innerHTML.trim().indexOf('!' + id) !== -1) {
            let issue = allIssues[key].closest('.issuable-info-container');
            issue.style.borderLeft = '5px solid ' + colors[mergeRequestStatus[id].status];
            issue.style.paddingLeft = '10px';
            if (undefined !== mergeRequestStatus[id].message && '' !== mergeRequestStatus[id].message) issue.querySelector('.merge-request-title').innerHTML += '<span>(' + mergeRequestStatus[id].message + ')</span>';
            break;
        }
    }
}

function newCallForDiscussions(id, isMine, isDone) {
    mergeRequestStatus[id] = {
        'status': 'wait',
    };
    xhrCondDisplay[id] = new XMLHttpRequest();
    xhrCondDisplay[id].onreadystatechange = function () {
        if (isMine) {
            handleMyMrCall(id, isDone);
        } else {
            handleOtherMrCall(id, isDone);
        }
    };
    xhrCondDisplay[id].open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests/' + id + '/discussions?per_page=100');
    xhrCondDisplay[id].send();
}

function getUpvoters(id, isMine, isDone) {
    xhrUpvoters[id] = new XMLHttpRequest();
    xhrUpvoters[id].onreadystatechange = function () {
        if (xhrUpvoters[id].readyState === 4) {
            myUpvotes[id] = false;
            let upvotes = JSON.parse(xhrUpvoters[id].responseText);
            if (upvotes.length > 0) {
                for (let [key, value] of Object.entries(upvotes)) {
                    if (value.name === 'thumbsup' && value.user.username === username) {
                        myUpvotes[id] = true;
                    }
                }
            }
            newCallForDiscussions(id, isMine, isDone);
        }
    };
    xhrUpvoters[id].open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests/' + id + '/award_emoji');
    xhrUpvoters[id].send();
}

//HANDLE MY MARGE REQUESTS

function handleMyMrCall(id, isDone) {
    if (xhrCondDisplay[id].readyState === 4) {
        allDiscussions = JSON.parse(xhrCondDisplay[id].responseText);
        let status = [];
        Object.keys(allDiscussions).forEach(discussionKey => {
            if (allDiscussions[discussionKey].notes[0].resolvable) {
                status.push(handleDiscussionMyMr(id, discussionKey));
            }
        });
        mergeRequestStatus[id] = {
            'status': status.indexOf('actions') !== -1 || isDone ? 'actions' : 'wait',
            'message': isDone && status.indexOf('wait') !== -1 ? 'Can be merge!' : '',
        };
        displayStatusMr(id);
    }
}

//HANDLE OTHERS MARGE REQUESTS

function handleOtherMrCall(id, isDone) {
    if (xhrCondDisplay[id].readyState === 4) {
        allDiscussions = JSON.parse(xhrCondDisplay[id].responseText);
        let counts = {
            my_discussions: 0,
            my_discussions_resolved: 0,
            my_discussions_not_resolved_to_count: 0,
            my_discussions_not_resolved_need_wait: 0,
        };
        Object.keys(allDiscussions).forEach(discussionKey => {
            let notes = allDiscussions[discussionKey].notes;
            if (notes[0].resolvable) {
                if (username === notes[0].author.username) {
                    counts.my_discussions++;
                    if (notes[0].resolved) {
                        counts.my_discussions_resolved++;
                    } else if (!notes[0].resolved && username !== notes[notes.length - 1].author.username) {
                        counts.my_discussions_not_resolved_to_count++;
                    } else {
                        counts.my_discussions_not_resolved_need_wait++;
                    }
                } else if (username !== notes[0].author.username && !notes[0].resolved && username === notes[notes.length - 1].author.username) {
                    counts.my_discussions_not_resolved_need_wait++;
                }
            }
        });
        let message = '';
        let status = 'done';
        if (myUpvotes[id] && counts.my_discussions_resolved === counts.my_discussions) {
            status = 'done';
        } else if (!isDone && !myUpvotes[id] && (0 === counts.my_discussions || (counts.my_discussions_resolved === counts.my_discussions && counts.my_discussions_not_resolved_need_wait < 1) || counts.my_discussions_not_resolved_to_count > 0)) {
            status = 'actions';
        } else if (!isDone && counts.my_discussions_not_resolved_need_wait > 0) {
            status = 'wait';
        }
        mergeRequestStatus[id] = {
            'status': status,
            'message': message,
        };
        displayStatusMr(id);
    }
}
