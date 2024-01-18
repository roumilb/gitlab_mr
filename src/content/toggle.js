const maxFetch = 15;
let currentFetch = 0;

function waitForLoading() {
    currentFetch++;
    let resolvedButtons = document.querySelectorAll('.line-resolve-btn.is-active');
    if (resolvedButtons.length === 0) {
        if (currentFetch <= maxFetch) {
            setTimeout(function () {
                waitForLoading();
            }, 500);
        }
    } else {
        loaded(resolvedButtons);
    }
}

function loaded(resolvedButtons) {
    for (let i = 0 ; i < resolvedButtons.length ; i++) {
        const header = resolvedButtons[i].closest('.note-header');
        if (!header) continue;

        const thread = header.closest('.timeline-content');
        if (!thread) continue;

        const headerInfo = header.querySelector('.note-header-info');
        if (!headerInfo) continue;
        headerInfo.outerHTML += '<div class="gtilab_mr_tools_toggle"><span>Toggle thread</span></div>';

        const firstComment = thread.querySelector('.timeline-discussion-body');
        if (!firstComment) continue;
        firstComment.style.display = 'none';

        header.querySelector('.gtilab_mr_tools_toggle').addEventListener('click', function () {
            firstComment.style.display = firstComment.style.display !== 'none' ? 'none' : 'block';
        });
    }
}

if (window.location.toString().indexOf('merge_requests') !== -1) waitForLoading();
