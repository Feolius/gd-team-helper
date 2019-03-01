/* global gapi chrome */
import {decorate, observable, reaction} from 'mobx';
import singleton from 'singleton';
import authStore from './Auth.js';

class FilesStore extends singleton {
    files = [];

    constructor() {
        super();
        reaction(() => authStore.authToken, (token) => {
            const request = gapi.client.request({
                'method': 'GET',
                'path': "/drive/v3/files?",
                'params': {
                    'fields': 'nextPageToken, files(id, name, parents, iconLink, owners, modifiedTime, size)',
                    'q': `sharedWithMe = true and mimeType = "application/vnd.google-apps.folder"`,
                    'pageToken': '',
                    'pageSize': 1000
                }
            });
            request.execute((response) => {
                console.log(response);
                if (response.files !== undefined) {
                    for (let file of response.files) {
                        this.files.push(file);
                    }
                } else {
                    // @TODO handle error here
                }
            });
        });
    }
}

export default decorate(FilesStore, {
    files: observable
}).get();