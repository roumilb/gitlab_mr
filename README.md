# Gitlab merge requests tools

This is a Google Chrome extension to enhance the Gitlab merge request UI.

chrome store: https://chrome.google.com/webstore/detail/gitlab-mr-tools/gefblbbchjoiikjegebbmilelbecgcaa

## How it works

There are 3 statuses for a merge request:

### Action needed: (default red)

**If you are the reviewer:** you didn't upvote the MR AND (all of your discussions are resolved OR you didn't start a discussion OR one of your discussion is not resolved and the last message is not from you)

**You created the merge request:** you have the upvotes needed for your merge request OR there is discussions not resolved and the last message is not from you

### Wait: (default orange)

**If you are the reviewer:** one of your discussions is not resolved and the last message is from you or one of the discussion is not from you and the last message is from you

**You created the merge request:** all of the discussions are resolved OR in discussions not resolved the last message have to be yours

### Done: (default green)

**If you are the reviewer:** all of your discussions are resolved and you've upvoted

**You created the merge request:** none

## Changelog

### v3.4

* Fix extension for all new gitlab UI

### v4

* Load every merge request at the same time instead of one by one
* Improve UI for the merge request list
* Add an option to do not track draft merge request
* Auto-detect username and gitlab url when no configuration is set
* Improve UI toggle of resolve comment

### v3.3

* Fix extension not loading on new gitlab version in specific project

### v3.2

* Fix extension not loading on new gitlab version

### v3.0

* Save the configuration automatically
* Don't display the done color if we still have discussions not resolved even if we approved the MR

### v2.6

* Make the extension work all groups merge request page

### v2.5

* Fix the extension on my merge request page
* Fix the message can be merged not showing up on MR without discussion

### v2

* Make the extension work in the page my merge request
* Add a condition for the "action"

### v1 initial release

* Display how much discussions are not resolved in the listing
* Display color code on the merge request for what you have to do
* Add settings (username, url, upvote needed, color code)
