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
        let header = resolvedButtons[i].closest('.note-header');
        if (null === header) continue;
        let thread = header.closest('.timeline-content');
        if (null === thread) continue;
        let firstComment = thread.querySelector('.timeline-discussion-body .note-body');
        if (null === firstComment) continue;
        firstComment.style.height = '0';
        firstComment.style.paddingTop = '20px';
        firstComment.style.position = 'relative';
        firstComment.innerHTML += '<div class="gtilab_mr_tools_toggle"><i class="fa fa-chevron-down"></i>Toggle thread</div>';

        firstComment.querySelector('.gtilab_mr_tools_toggle').addEventListener('click', function (event) {
            let icon = event.target.querySelector('i');
            if (firstComment.style.height === 'auto') {
                firstComment.style.height = '0';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                firstComment.style.height = 'auto';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    }
}

if (window.location.toString().indexOf('merge_requests') !== -1) waitForLoading();
