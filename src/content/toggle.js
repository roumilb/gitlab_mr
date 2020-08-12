let maxFetch = 15;
let currentFect = 0;

function waitForLoading() {
    currentFect++;
    let resolvedButtons = document.querySelectorAll('.line-resolve-btn');
    if (resolvedButtons.length === 0) {
        if (currentFect <= maxFetch) {
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
        let thread = resolvedButtons[i].closest('.timeline-content');
        if (null === thread) continue;
        let firstComment = thread.querySelector('.timeline-discussion-body .note-body');
        if (null === firstComment) continue;
        firstComment.style.height = '0';
        firstComment.style.paddingTop = '20px';
        firstComment.style.position = 'relative';
        firstComment.innerHTML += '<div class="gtilab_mr_tools_toggle">Toggle thread</div>';

        firstComment.querySelector('.gtilab_mr_tools_toggle').addEventListener('click', function () {
            firstComment.style.height = firstComment.style.height === 'auto' ? '0' : 'auto';
        });
    }
}

if (window.location.toString().indexOf('merge_requests') !== -1) waitForLoading();
