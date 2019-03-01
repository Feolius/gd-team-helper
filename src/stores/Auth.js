/* global gapi chrome */
import {decorate, observable} from 'mobx';
import singleton from 'singleton';

class AuthStore extends singleton {
    authToken = false;
    files = [];

    constructor() {
        super();
        chrome.identity.getAuthToken({'interactive': true}, (token) => {
            gapi.load('client', {
                callback: () => {
                    gapi.client.setToken({access_token: token});
                    this.authToken = token;
                },
                onerror: () => {
                    // @TODO handle error here properly
                    alert('gapi.client failed to load!');
                },
                timeout: 5000, // 5 seconds.
                ontimeout: () => {
                    // @TODO handle error here properly
                    alert('gapi.client could not load in a timely manner!');
                }
            });
        });
    }
}

export default decorate(AuthStore, {
    authToken: observable
}).get();
