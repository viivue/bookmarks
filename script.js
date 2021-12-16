const DEV = true;
const settings = {
    "url": 'https://api.github.com/repos/viivue/bookmarks/issues?label=svg',
    "method": "GET",
    "timeout": 0,
    "error": (response, status) => {
        if(DEV) console.log('requestGitlabAPI', settings, response, status);
    }
};

$.ajax(settings).done((response, status) => {
    if(DEV) console.log('requestGitlabAPI', settings, status);
    console.log(response);
});