jQuery(function($){
    const DEV = true;

    class Bookmark{
        constructor(owner, repo){
            this.token = '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';
            this.apiURL = `https://api.github.com/repos/${owner}/${repo}/`;
            this.bookmarkContainer = $('[data-container]');
            this.labelContainer = $('[data-labels]');

            // get label
            this.getLabels(response => {
                for(const label of response){
                    const color = hexToRgb(`#${label.color}`);

                    this.labelContainer.append(`
                       <li>
                       <a href="#" class="label" style="--label-r:${color.r};--label-g:${color.g};--label-b:${color.b};">${label.name}</a>
                       </li>
                       `);
                }
            });

            // get issue
            this.getIssues('', response => {
                for(const issue of response){
                    this.bookmarkContainer.append(this.getBookmarkItemHTML(issue));
                }
            });
        }

        getBookmarkItemHTML(issueObject){
            const url = new URL(issueObject.title);
            const title = url.host.replace('www.', '');

            return `
                <li>
                <a href="${issueObject.title}" target="_blank" class="btn_underline">${title}</a>
                <div>${issueObject.body}</div>
                </li>
            `;
        }

        getQueryObject(string){
            const url = `${this.apiURL}${string}`;
            const query = {
                "url": url, "method": "GET", "timeout": 0, "error": (response, status) => {
                    if(DEV) console.log('getQuery', url, response, status);
                }
            };

            // with token
            if(this.token.length){
                query['headers'] = {"authorization": `token ${this.token}`};
            }

            return query;
        }

        getIssues(labels = '', callback){
            $.ajax(this.getQueryObject(`issues?state=closed&labels=${labels}`)).done((response, status) => {
                callback(response);
            });
        }

        getLabels(callback){
            $.ajax(this.getQueryObject(`labels`)).done((response, status) => {
                callback(response);
            });
        }
    }

    const bookmark = new Bookmark('viivue', 'bookmarks');
});