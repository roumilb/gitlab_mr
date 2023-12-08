handleChangedOptions();

// Init option values
chrome.storage.sync.get(['gitlabmr'], function (result) {
    // default option values
    let username = '';
    let gitlabUrl = '';
    let workWith = 'upvotes';
    let upvotes = 2;
    let tracking = '';
    let colors = {
        actions: '#FF2D00',
        wait: '#FFDC00',
        done: '#00E90E'
    };

    // Use saved values if any
    if (result.gitlabmr !== undefined) {
        if (result.gitlabmr.username !== undefined) username = result.gitlabmr.username;
        if (result.gitlabmr.url !== undefined) gitlabUrl = result.gitlabmr.url;
        if (result.gitlabmr.working_with !== undefined) workWith = result.gitlabmr.working_with;
        if (result.gitlabmr.upvotes !== undefined) upvotes = result.gitlabmr.upvotes;
        if (result.gitlabmr.tracking !== undefined) tracking = result.gitlabmr.tracking;
        if (result.gitlabmr.colors !== undefined) colors = result.gitlabmr.colors;
    }

    // Set the option values
    document.getElementById('gitlab-mr__settings__username').value = username;
    document.getElementById('gitlab-mr__settings__url').value = gitlabUrl;
    if (result.gitlabmr.working_with === 'approvals') {
        document.getElementById('gitlab-mr__approval').checked = true;
    } else {
        document.getElementById('gitlab-mr__upvotes').checked = true;
        let event = new Event('change');
        document.getElementById('gitlab-mr__upvotes').dispatchEvent(event);
    }
    document.getElementById('gitlab-mr__settings__upvotes').value = upvotes;
    document.getElementById('gitlab-mr__track__mr').value = tracking;
    document.getElementById('gitlab-mr__color_action').value = colors.actions;
    document.getElementById('gitlab-mr__color_wait').value = colors.wait;
    document.getElementById('gitlab-mr__color_done').value = colors.done;
});

function handleChangedOptions() {
    document.getElementById('gitlab-mr__upvotes').addEventListener('change', changeStatusWorkWith);
    document.getElementById('gitlab-mr__approval').addEventListener('change', changeStatusWorkWith);

    document.querySelectorAll('[type="text"], [type="number"]').forEach((element) => {
        element.addEventListener('keydown', (event) => {
            setTimeout(() => {
                saveOptions();
            }, 100);
        });
    });

    // we do it for input numbers in case the user clicks the up/down arrows
    document.querySelectorAll('[type="radio"], [type="color"], [type="text"], [type="number"], select').forEach((element) => {
        element.addEventListener('change', (event) => {
            setTimeout(() => {
                saveOptions();
            }, 100);
        });
    });
}

function changeStatusWorkWith() {
    document.querySelector('.gitlab-mr__settings__upvotes__container').style.display = this.value === 'upvotes' ? 'flex' : 'none';
}

function saveOptions() {
    const workWith = document.querySelector('input[name="working_with"]:checked').value;
    const options = {
        username: document.getElementById('gitlab-mr__settings__username').value,
        url: document.getElementById('gitlab-mr__settings__url').value,
        working_with: workWith === undefined ? 'upvotes' : workWith,
        upvotes: document.getElementById('gitlab-mr__settings__upvotes').value,
        tracking: document.getElementById('gitlab-mr__track__mr').value,
        colors: {
            actions: document.getElementById('gitlab-mr__color_action').value,
            wait: document.getElementById('gitlab-mr__color_wait').value,
            done: document.getElementById('gitlab-mr__color_done').value
        }
    };

    chrome.storage.sync.set({'gitlabmr': options}, function () {
        const savedContainer = document.querySelector('#gitlab-mr__saved');
        savedContainer.innerHTML = 'Configuration saved';
        setTimeout(() => {
            savedContainer.innerHTML = '';
        }, 2000);
    });
}
