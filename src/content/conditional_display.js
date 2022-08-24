const mergeRequestStatus = {}, xhrCondDisplay = [], xhrUpvoters = [], myUpvotes = {};
let mrCondDisplay, allDiscussions;

function initConditionalDisplay() {
    getAllMergeRequests(sortMergeRequest);
}

function getMrIsDone(mrID, isMine, mergeRequestId) {
    const xhrApproval = new XMLHttpRequest();
    xhrApproval.onreadystatechange = function () {
        if (xhrApproval.readyState === 4) {
            const res = JSON.parse(xhrApproval.responseText);
            getUpvoters(mrID, isMine, res.approved === true, projectId, mergeRequestId);
        }
    };
    xhrApproval.open('GET', apiUrlBase + '/projects/' + projectId + '/merge_requests/' + mrID + '/approvals');
    xhrApproval.send();
}

function sortMergeRequest() {
    if (xhrGetAllMergeRequests.readyState === 4 && xhrGetAllMergeRequests.status >= 200 && xhrGetAllMergeRequests.status <= 299) {
        mrCondDisplay = JSON.parse(xhrGetAllMergeRequests.responseText);
        Object.keys(mrCondDisplay).forEach(key => {
            const isMine = mrCondDisplay[key].author.username === username;
            if (!isMine && tracking === 'not_mine') {
                addOpacityIfNotTracked(mrCondDisplay[key].id);
                return;
            }

            if (workWith === 'upvotes') {
                getUpvoters(
                    mrCondDisplay[key].iid,
                    isMine,
                    mrCondDisplay[key].upvotes >= upvotesNeeded && mrCondDisplay[key].downvotes === 0,
                    projectId,
                    mrCondDisplay[key].id
                );
            } else {
                getMrIsDone(mrCondDisplay[key].iid, isMine, mrCondDisplay[key].id);
            }
        });
    }
}

function addOpacityIfNotTracked(mergeRequestId) {
    const issue = document.getElementById(`merge_request_${mergeRequestId}`).getElementsByClassName('issuable-info-container')[0];
    if (issue === null) return;
    issue.style.opacity = '.5';
}

function displayStatusMr(mergeRequestId) {
    const issueContainer = document.getElementById(`merge_request_${mergeRequestId}`);
    if (!issueContainer) {
        return;
    }
    const issue = document.getElementById(`merge_request_${mergeRequestId}`).getElementsByClassName('issuable-info-container')[0];
    if (issue === null) return;
    issue.style.borderLeft = '5px solid ' + colors[mergeRequestStatus[mergeRequestId].status];
    issue.style.paddingLeft = '10px';
    if (undefined !== mergeRequestStatus[mergeRequestId].message && '' !== mergeRequestStatus[mergeRequestId].message) {
        issue.querySelector('.merge-request-title').innerHTML += '<span>(' + mergeRequestStatus[mergeRequestId].message + ')</span>';
    }
}

function newCallForDiscussions(id, isMine, isDone, projectID, mergeRequestId) {
    if (undefined === projectID) projectID = projectId;
    mergeRequestStatus[mergeRequestId] = {
        'status': 'wait'
    };
    xhrCondDisplay[mergeRequestId] = new XMLHttpRequest();
    xhrCondDisplay[mergeRequestId].onreadystatechange = function () {
        if (isMine) {
            handleMyMrCall(id, isDone, mergeRequestId);
        } else {
            handleOtherMrCall(id, isDone, mergeRequestId);
        }
    };

    xhrCondDisplay[mergeRequestId].open('GET', `${apiUrlBase}/projects/${projectID}/merge_requests/${id}/discussions?per_page=100`);
    xhrCondDisplay[mergeRequestId].send();
}

function getUpvoters(id, isMine, isDone, projectID, mergeRequestId) {
    if (undefined === projectID) projectID = projectId;
    xhrUpvoters[mergeRequestId] = new XMLHttpRequest();
    xhrUpvoters[mergeRequestId].onreadystatechange = function () {
        if (xhrUpvoters[mergeRequestId].readyState === 4) {
            myUpvotes[mergeRequestId] = false;
            const upvotes = JSON.parse(xhrUpvoters[mergeRequestId].responseText);
            if (upvotes.length > 0) {
                for (const [, value] of Object.entries(upvotes)) {
                    if (value.name === 'thumbsup' && value.user.username === username) {
                        myUpvotes[mergeRequestId] = true;
                    }
                }
            }
            newCallForDiscussions(id, isMine, isDone, projectID, mergeRequestId);
        }
    };
    xhrUpvoters[mergeRequestId].open('GET', apiUrlBase + '/projects/' + projectID + '/merge_requests/' + id + '/award_emoji');
    xhrUpvoters[mergeRequestId].send();
}

//HANDLE MY MERGE REQUESTS

function handleMyMrCall(id, isDone, mergeRequestId) {
    if (xhrCondDisplay[mergeRequestId].readyState === 4) {
        allDiscussions = JSON.parse(xhrCondDisplay[mergeRequestId].responseText);
        const status = [];
        Object.keys(allDiscussions).forEach(discussionKey => {
            if (allDiscussions[discussionKey].notes[0].resolvable) {
                status.push(handleDiscussionMyMr(id, discussionKey));
            }
        });
        if (status.length === 0) status.push('wait');
        mergeRequestStatus[mergeRequestId] = {
            status: status.indexOf('actions') !== -1 || isDone ? 'actions' : 'wait',
            message: isDone && !status.includes('actions') ? 'Can be merged!' : ''
            // 'message': isDone && status.indexOf('wait') !== -1 ? 'Can be merged!' : ''
        };
        displayStatusMr(mergeRequestId);
    }
}

//HANDLE OTHERS MARGE REQUESTS

function handleOtherMrCall(id, isDone, mergeRequestId) {
    if (xhrCondDisplay[mergeRequestId].readyState === 4) {
        allDiscussions = JSON.parse(xhrCondDisplay[mergeRequestId].responseText);
        const counts = {
            my_discussions: 0,
            my_discussions_resolved: 0,
            my_discussions_not_resolved_to_count: 0,
            my_discussions_not_resolved_need_wait: 0
        };
        let participated = false;
        Object.keys(allDiscussions).forEach(discussionKey => {
            const notes = allDiscussions[discussionKey].notes;
            if (tracking === 'not_mine_participate') {
                notes.map(note => {
                    if (note.author.username === username) participated = true;
                });
            }
            if (notes[0].resolvable) {
                const lastNoteKey = getLastNoteKey(notes, notes.length);
                if (username === notes[0].author.username) {
                    counts.my_discussions++;
                    if (notes[0].resolved) {
                        counts.my_discussions_resolved++;
                    } else if (!notes[0].resolved && username !== notes[lastNoteKey].author.username) {
                        counts.my_discussions_not_resolved_to_count++;
                    } else {
                        counts.my_discussions_not_resolved_need_wait++;
                    }
                } else if (username !== notes[0].author.username && !notes[0].resolved && username === notes[lastNoteKey].author.username) {
                    counts.my_discussions_not_resolved_need_wait++;
                }
            }
        });
        if (!participated && tracking === 'not_mine_participate') {
            addOpacityIfNotTracked(mergeRequestId);
            return;
        }
        let message = '';
        let status = 'done';
        if (myUpvotes[mergeRequestId] && counts.my_discussions_resolved === counts.my_discussions) {
            status = 'done';
        } else if (!isDone && !myUpvotes[mergeRequestId] && (0 === counts.my_discussions || (counts.my_discussions_resolved
                                                                                             === counts.my_discussions
                                                                                             && counts.my_discussions_not_resolved_need_wait
                                                                                             < 1) || counts.my_discussions_not_resolved_to_count > 0)) {
            status = 'actions';
        } else if (!isDone && counts.my_discussions_not_resolved_need_wait > 0) {
            status = 'wait';
        }
        mergeRequestStatus[mergeRequestId] = {
            status,
            message
        };
        displayStatusMr(mergeRequestId);
    }
}

function getLastNoteKey(notes, length) {
    return notes[length - 1].system ? getLastNoteKey(notes, length - 1) : length - 1;
}
