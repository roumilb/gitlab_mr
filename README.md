# Gitlab merge requests tools

This is a chrome extension to have a better display on the merge request page.

chrome store: https://chrome.google.com/webstore/detail/gitlab-mr-tools/gefblbbchjoiikjegebbmilelbecgcaa

# How it works

There is 3 status for a merge request:
### Action needed: (default red)
**If you are the reviewer:** you didn't upvote the MR AND (all of your discussions are resolved OR you didn't start a discussion OR one of your discussion is not resolved and the last message is not from you)

**You created the merge request:** you have the upvotes needed for your merge request OR there is discussions not resolved and the last message is not from you

### Wait: (default orange)
**If you are the reviewer:** one of your discussions is not resolved and the last message is from you or one of the discussion is not from you and the last message is from you

**You created the merge request:** all of the discussions are resolved OR in discussions not resolved the last message have to be yours

### Done: (default green)
**If you are the reviewer:** all of your discussions are resolved and you've upvoted

**You created the merge request:** none

# Changelog

### v2 

* Make the extenson work in the page my merge request
* Add a condition for the "action"

### v1 initial release 

* Display how mush discussions are not resolve in the listing
* Display color code on the merge request for what you have to do
* Add settings (username, url, upvote needed, color code)
