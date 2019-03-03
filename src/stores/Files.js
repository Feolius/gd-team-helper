/* global gapi chrome */
import {decorate, observable, reaction} from 'mobx';
import singleton from 'singleton';
import authStore from './Auth.js';

class FilesStore extends singleton {
    processingRequest = false;
    files = [];

    constructor() {
        super();
        reaction(() => authStore.authToken, (token) => {
            this.processingRequest = true;
            _getFilesChildren('').then((files) => {
                this.files = files;
                this.processingRequest = false;
            }, (error) => {
                // @TODO handle errors here
            });
        });
    }
}

async function _getFilesChildren(parentFileId) {
    const files = [];
    let response = {nextPageToken: ''};
    while (response.nextPageToken !== undefined) {
        response = await _listFilesRequest(parentFileId, response.nextPageToken);
        if (response.files !== undefined) {
            files.push(...response.files)
        } else {
            // @TODO handle errors here
        }
    }
    return files;
}

function _listFilesRequest(parentFileId, pageToken = '') {
    return new Promise((resolve => {
        let q = `"${parentFileId}" in parents`;
        if (parentFileId === '') {
            q = 'sharedWithMe = true';
        }
        const request = gapi.client.request({
            'method': 'GET',
            'path': "/drive/v3/files?",
            'params': {
                'fields': 'nextPageToken, files(id, name, parents, iconLink, owners, modifiedTime, size)',
                'q': q,
                'pageToken': pageToken,
                'pageSize': 1000
            }
        });
        request.execute((response) => {
            resolve(response);
        });
    }));
}

export default decorate(FilesStore, {
    processingRequest: observable,
    files: observable
}).get();
