let colors = {
    actions: '#FF2D00',
    wait: '#FFDC00',
    done: '#00E90E'
};

function changeStatusWorkWith() {
    if (this.value === 'upvotes') {
        document.querySelector('.gitlab-mr__settings__upvotes__container').style.display = 'flex';
    } else {
        document.querySelector('.gitlab-mr__settings__upvotes__container').style.display = 'none';
    }
}

document.getElementById('gitlab-mr__upvotes').addEventListener('change', changeStatusWorkWith);
document.getElementById('gitlab-mr__approval').addEventListener('change', changeStatusWorkWith);

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
        document.getElementById('gitlab-mr__settings__upvotes').value = result.gitlabmr.upvotes === undefined ? 2 : result.gitlabmr.upvotes;
        if ((result.gitlabmr.working_with === undefined && result.gitlabmr.upvotes === undefined) || result.gitlabmr.working_with === 'approvals') {
            document.getElementById('gitlab-mr__approval').checked = true;
        } else {
            document.getElementById('gitlab-mr__upvotes').checked = true;
            let event = new Event('change');
            document.getElementById('gitlab-mr__upvotes').dispatchEvent(event);
        }
    } else {
        document.getElementById('gitlab-mr__color_action').value = colors.actions;
        document.getElementById('gitlab-mr__color_wait').value = colors.wait;
        document.getElementById('gitlab-mr__color_done').value = colors.done;
        document.getElementById('gitlab-mr__color_done').value = colors.done;
    }
});

function saveOptions() {
    const usernamePopup = document.getElementById('gitlab-mr__settings__username').value;
    const urlPopup = document.getElementById('gitlab-mr__settings__url').value;
    const upvotesPopup = document.getElementById('gitlab-mr__settings__upvotes').value;
    const colorsPopup = {
        actions: document.getElementById('gitlab-mr__color_action').value,
        wait: document.getElementById('gitlab-mr__color_wait').value,
        done: document.getElementById('gitlab-mr__color_done').value
    };
    const tracking = document.getElementById('gitlab-mr__track__mr').value;
    const workWith = document.querySelector('input[name="working_with"]:checked').value;
    const options = {
        username: usernamePopup,
        url: urlPopup,
        colors: colorsPopup,
        upvotes: upvotesPopup,
        tracking: tracking,
        working_with: workWith === undefined ? 'upvotes' : workWith
    };
    chrome.storage.sync.set({'gitlabmr': options}, function () {
        let savedContainer = document.querySelector('#gitlab-mr__saved');
        savedContainer.innerHTML = 'Configuration saved';
        setTimeout(() => {
            savedContainer.innerHTML = '';
        }, 2000);
    });
}

document.querySelectorAll('[type="text"], [type="number"]').forEach((element) => {
    element.addEventListener('keydown', (event) => {
        setTimeout(() => {
            saveOptions();
        }, 100);
    });
});

document.querySelectorAll('[type="radio"], [type="color"], select').forEach((element) => {
    element.addEventListener('change', (event) => {
        setTimeout(() => {
            saveOptions();
        }, 100);
    });
});

document.getElementById('save').addEventListener('click', (event) => {
    setTimeout(() => {
        saveOptions();
    }, 100);
});
