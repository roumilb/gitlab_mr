let colors = {
    actions: '#FF2D00',
    wait: '#FFDC00',
    done: '#00E90E'
};

chrome.storage.sync.get(['gitlabmr'], function (result) {
    if (result.gitlabmr !== undefined) {
        document.getElementById('gitlab-mr__settings__username').value = result.gitlabmr.username === undefined ? '' : result.gitlabmr.username;
        document.getElementById('gitlab-mr__settings__url').value = result.gitlabmr.url === undefined ? '' : result.gitlabmr.url;
        document.getElementById('gitlab-mr__color_action').value = result.gitlabmr.colors.actions === undefined
                                                                   ? colors.actions
                                                                   : result.gitlabmr.colors.actions;
        document.getElementById('gitlab-mr__color_wait').value = result.gitlabmr.colors.wait === undefined ? colors.wait : result.gitlabmr.colors.wait;
        document.getElementById('gitlab-mr__color_done').value = result.gitlabmr.colors.done === undefined ? colors.done : result.gitlabmr.colors.done;
        document.getElementById('gitlab-mr__track__mr').value = result.gitlabmr.tracking === undefined ? '' : result.gitlabmr.tracking;
    } else {
        document.getElementById('gitlab-mr__color_action').value = colors.actions;
        document.getElementById('gitlab-mr__color_wait').value = colors.wait;
        document.getElementById('gitlab-mr__color_done').value = colors.done;
    }
});

document.getElementById('save').addEventListener('click', (event) => {
    let usernamePopup = document.getElementById('gitlab-mr__settings__username').value;
    let urlPopup = document.getElementById('gitlab-mr__settings__url').value;
    let upvotesPopup = document.getElementById('gitlab-mr__settings__upvotes').value;
    let colorsPopup = {
        actions: document.getElementById('gitlab-mr__color_action').value,
        wait: document.getElementById('gitlab-mr__color_wait').value,
        done: document.getElementById('gitlab-mr__color_done').value
    };
    let tracking = document.getElementById('gitlab-mr__track__mr').value;
    let options = {
        username: usernamePopup,
        url: urlPopup,
        colors: colorsPopup,
        upvotes: upvotesPopup,
        tracking: tracking
    };
    chrome.storage.sync.set({'gitlabmr': options}, function () {
        let savedContainer = document.querySelector('#gitlab-mr__saved');
        savedContainer.innerHTML = 'Configuration saved';
        setTimeout(() => {
            savedContainer.innerHTML = '';
        }, 2000);
    });
});
