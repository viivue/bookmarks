const DEV = true;
const token = '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';
const query = {
    "url": 'https://api.github.com/repos/viivue/bookmarks/issues',
    headers: {"authorization": `token ${token}`},
    "method": "GET",
    "timeout": 0,
    "error": (response, status) => {
        if(DEV) console.log('requestGitlabAPI', query, response, status);
    }
};

$.ajax(query).done((response, status) => {
    const $main = $('main');
    for(const item of response){
        const color = item.labels[0].color;
        let labelsHTML = '';
        for(const label of item.labels){
            labelsHTML += `<li>${label.name}</li>`;
        }

        $main.append(`
            <article style="background-color:#${color}">
            <h2>${item.title}</h2>
            <div>${item.body}</div>
            <ul>${labelsHTML}</ul>
            </article>
        `);
        console.log(item)
    }
});