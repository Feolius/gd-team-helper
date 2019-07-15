import gapiRequestsPool from "lib/GapiRequestsPool";

const FILES_LIST_REQUEST_PAGE_SIZE = 1000;

export default class FilesListRequestWrapper {
    _pageToken = '';
    _filters = [];

    constructor(q) {
        this.q = q;
    }

    async getFiles() {
        const files = [];
        let filesPart = [];
        let i = 0;
        while (this._pageToken !== false) {
            filesPart = await this._makeRequest();
            files.push(...filesPart);
            i++;
        }
        return files;
    }

    _makeRequest() {
        return new Promise(resolve => {
            gapiRequestsPool.request({
                'method': 'GET',
                'path': "/drive/v3/files?",
                'params': {
                    'fields': 'nextPageToken, files(id, name, parents, iconLink, owners, webViewLink, mimeType)',
                    'q': this.q,
                    'pageToken': this._pageToken,
                    'pageSize': FILES_LIST_REQUEST_PAGE_SIZE
                }
            }).then(response => {
                this._pageToken = response.nextPageToken !== undefined ? response.nextPageToken : false;
                let files = [];
                if (response.files !== undefined) {
                    files = response.files;
                    for (const filter of this._filters) {
                        files = files.filter(filter)
                    }
                } else {
                    // @TODO handle error?
                }
                resolve(files);
            });
        });
    }

    addFilter(cb) {
        this._filters.push(cb);
    }
}
