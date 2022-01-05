jQuery(function($){
    const DEV = true;

    class Bookmark{
        constructor(owner, repo){
            this.token = '';
            this.apiURL = `https://api.github.com/repos/${owner}/${repo}/`;
            this.bookmarkContainer = $('[data-container]');
            this.labelContainer = $('[data-labels]');
            this.selectedLabels = [];

            // get label
            this.getLabels(response => {
                for(const label of response){
                    this.labelContainer.append(this.getLabelItemHTML(label));
                }
                this.assignFilterEvent();

                // get issue
                this.getIssues(() => {
                    $('body').removeClass('loading');
                });
            });
        }

        onFilterClick(label){
            if(this.selectedLabels.includes(label)){
                // remove
                const index = this.selectedLabels.indexOf(label);
                if(index > -1){
                    this.selectedLabels.splice(index, 1);
                }
            }else{
                // add
                this.selectedLabels.push(label);
            }


            this.getIssues();
        }

        updateLabelStatus(){
            if(this.selectedLabels.length < 1){
                $('[data-filter]').addClass('active');
            }else{
                $('[data-filter]').each((i, e) => {
                    const label = $(e).attr('data-filter');
                    if(this.selectedLabels.includes(label)){
                        $(e).addClass('active');
                    }else{
                        $(e).removeClass('active');
                    }
                });
            }
        }

        assignFilterEvent(){
            const $filters = $('[data-filter]:not(.assigned)');

            $filters.on('click', e => {
                this.onFilterClick($(e.target).attr('data-filter'));
            });

            $filters.addClass('assigned');
        }

        getLabelItemHTML(labelObject){
            const color = hexToRgb(`#${labelObject.color}`);
            const style = `--label-r:${color.r};--label-g:${color.g};--label-b:${color.b};`;

            return `
                   <li>
                   <button data-filter="${labelObject.name}" class="label" style="${style}">${labelObject.name}</button>
                   </li>
                   `;
        }

        getBookmarkItemHTML(issueObject){
            const url = new URL(issueObject.title);
            const title = url.host.replace('www.', '');

            let labelsHTML = '';
            const labelsArray = [];

            for(const label of issueObject.labels){
                labelsArray.push(label.name);
                labelsHTML += `<li>[${label.name}]</li>`;
            }
            return `
                <li>
                <div><a href="${issueObject.title}" target="_blank" class="btn_underline">${title}</a></div>
                <div>${issueObject.body ?? ''}</div>
                <div>[${labelsArray.join(',')}]</div>
                <div class="view-issue"><a href="${issueObject.html_url}" target="_blank">edit</a></div>
                </li>
            `;
        }

        getQueryObject(string){
            const url = `${this.apiURL}${string}`;
            const query = {
                "url": url, "method": "GET", "timeout": 0, "error": (response, status) => {
                    if(DEV) console.log('getQuery', url, response, status);
                    this.bookmarkContainer.html(`<h3>${response.responseText}</h3>`);
                    $('.loading').removeClass('loading');
                }
            };

            // with token
            if(this.token.length){
                query['headers'] = {"authorization": `token ${this.token}`};
            }

            return query;
        }

        getIssues(callback){
            this.bookmarkContainer.addClass('loading');
            $.ajax(this.getQueryObject(`issues?state=closed&sort=updated&per_page=100&labels=${this.selectedLabels.join(',')}`)).done((response, status) => {
                // remove
                this.bookmarkContainer.html('');

                if(response.length){
                    // new bookmark
                    for(const issue of response){
                        this.bookmarkContainer.append(this.getBookmarkItemHTML(issue));
                    }
                }else{
                    this.bookmarkContainer.append(`<h3 style="text-align:center">No results matched your filter.</h3>`);
                }

                if(typeof callback === 'function'){
                    callback(response);
                }
                this.bookmarkContainer.removeClass('loading');
            });

            this.updateLabelStatus();
        }

        getLabels(callback){
            this.labelContainer.addClass('loading');
            $.ajax(this.getQueryObject(`labels`)).done((response, status) => {
                if(typeof callback === 'function'){
                    callback(response);
                }
                this.labelContainer.removeClass('loading');
            });
        }
    }


    // load settings from storage
    const browserStorage = new MyStorage('viivue-bookmarks');

    // init
    const bookmark = new Bookmark('viivue', 'bookmarks');
});