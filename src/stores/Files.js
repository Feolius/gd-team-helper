/* global gapi chrome */
import {decorate, observable, reaction, extendObservable, computed} from 'mobx';
import singleton from 'singleton';
import authStore from 'stores/Auth.js';

const MAX_FILES_LIST_REQUESTS_IN_ROW = 10;
const FILES_LIST_REQUEST_PAGE_SIZE = 1000;

class FilesStore extends singleton {
    processingRequest = false;
    files = [];
    currentFolderId = "";
    filesListRequest = null;

    constructor() {
        super();
        reaction(() => authStore.authToken, (token) => {
            this.processingRequest = true;
            this.filesListRequest = new FilesListRequestWrapper('sharedWithMe = true');
            this.filesListRequest.addFilter(file => file.parents === undefined || file.parents.length === 0);
            this._updateFileList();
        });
    }

    _updateFileList() {
        this.filesListRequest.getFiles().then((files) => {
            this.files.push(...files);
            this.processingRequest = false;
        }, (error) => {
            // @TODO handle errors here
        });
    }

    get filesSorted() {
        let folders = this.files.filter(file => file.mimeType === 'application/vnd.google-apps.folder');
        let files = this.files.filter(file => file.mimeType !== 'application/vnd.google-apps.folder');
        const compareFileNames = (file1, file2) => {
            if (file1.name > file2.name) {
                return 1;
            }
            if (file1.name < file2.name) {
                return -1;
            }
            return 0;
        };
        folders.sort(compareFileNames);
        files.sort(compareFileNames);
        return [...folders, ...files];
    }
}

class FilesListRequestWrapper {
    _pageToken = '';
    _filters = [];

    constructor(q) {
        this.q = q;
        extendObservable(this, {
            _pageToken: this._pageToken,
            get pageToken() {
                return this._pageToken;
            }
        })
    }

    async getFiles() {
        const files = [];
        let filesPart = [];
        let i = 0;
        while (this._pageToken !== false && i < MAX_FILES_LIST_REQUESTS_IN_ROW) {
            filesPart = await this._makeRequest();
            files.push(...filesPart);
            i++;
        }
        return files;
    }

    _makeRequest() {
        return new Promise(resolve => {
            const request = gapi.client.request({
                'method': 'GET',
                'path': "/drive/v3/files?",
                'params': {
                    'fields': 'nextPageToken, files(id, name, parents, iconLink, owners, modifiedTime, mimeType)',
                    'q': this.q,
                    'pageToken': this._pageToken,
                    'pageSize': FILES_LIST_REQUEST_PAGE_SIZE
                }
            });
            request.execute((response) => {
                this._pageToken = response.nextPageToken !== undefined ? response.nextPageToken : false;
                let files = [];
                if (response.files !== undefined) {
                    for (const filter of this._filters) {
                        files = response.files.filter(filter)
                    }
                }
                resolve(files);
            });
        });
    }

    addFilter(cb) {
        this._filters.push(cb);
    }
}

export default decorate(FilesStore, {
    processingRequest: observable,
    files: observable,
    fileListRequest: observable,
    filesSorted: computed
}).get();
