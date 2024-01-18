function needTracking(mergeRequest) {
    switch (tracking) {
        case 'not_mine':
            const isMine = mergeRequest.author.username === username;
            if (!isMine && tracking === 'not_mine') {
                addOpacityIfNotTracked(mergeRequest.id);
                return false;
            }
            break;
        case 'draft':
            if (mergeRequest.draft) {
                addOpacityIfNotTracked(mergeRequest.id);
                return false;
            }
            break;
        default:
            return true;
    }

    return true;
}
