/* global gapi chrome */
import {decorate, observable, reaction, computed} from 'mobx';
import singleton from 'singleton';
import authStore from 'stores/Auth.js';

const MAX_FILES_LIST_REQUESTS_IN_ROW = 10;
const FILES_LIST_REQUEST_PAGE_SIZE = 1000;

class FilesStore extends singleton {
    processingRequest = false;
    files = [];
    _filesPath = [];
    filesListRequest = null;
    filesSelected = {};

    constructor() {
        super();
        reaction(() => authStore.authToken, (token) => {
            this.filesListRequest = new FilesListRequestWrapper('sharedWithMe = true');
            // It's first request. And we leave only those files which doesn't have parents, because we are going to build "root" folder.
            this.filesListRequest.addFilter(file => file.parents === undefined || file.parents.length === 0);
            this._updateFileList();
        });
        // reaction(() => this.currentFolderId, (fileId) => {
        //     this.filesListRequest = new FilesListRequestWrapper(`"${fileId}" in parents`);
        //     this._updateFileList();
        // });
        reaction(() => this._filesPath.slice(), (filesPath) => {
            let q = 'sharedWithMe = true';
            if (filesPath.length > 0) {
                q = `"${filesPath[filesPath.length - 1]}" in parents`;
            }
            this.filesListRequest = new FilesListRequestWrapper(q);
            this._updateFileList();
        });
    }

    _updateFileList() {
        this.processingRequest = true;
        this.files = [];
        this.filesSelected = {};
        this.filesListRequest.getFiles().then((files) => {
            this.files.push(...files);
            this.processingRequest = false;
        }, (error) => {
            // @TODO handle errors here
        });
    }

    _setCurrentFolder(fileId) {

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
        // We need map here because we should be able to find file by file id.
        return new Map([...folders, ...files].map((file) => [file.id, file]));
    }

    selectFile(fileId) {
        this.filesSelected[fileId] = 1;
    }

    unselectFile(fileId) {
        delete this.filesSelected[fileId];
    }

    selectAllFiles() {
        for (const file of this.filesSorted) {
            this.filesSelected[file.id] = 1;
        }
    }

    unselectAllFiles() {
        this.filesSelected = {};
    }
}

class FilesListRequestWrapper {
    _pageToken = '';
    _filters = [];

    constructor(q) {
        this.q = q;
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
                    'fields': 'nextPageToken, files(id, name, parents, iconLink, owners, webViewLink, mimeType)',
                    'q': this.q,
                    'pageToken': this._pageToken,
                    'pageSize': FILES_LIST_REQUEST_PAGE_SIZE
                }
            });
            request.execute((response) => {
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

class FilesPath {
    constructor() {

    }
}

export default decorate(FilesStore, {
    processingRequest: observable,
    files: observable,
    fileListRequest: observable,
    filesSelected: observable,
    // currentFolderId: observable,
    _filesPath: observable,
    filesSorted: computed
}).get();
