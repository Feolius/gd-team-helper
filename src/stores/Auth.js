/* global gapi chrome */
import {decorate, observable, action} from 'mobx';
import singleton from 'singleton';

class AuthStore extends singleton {
    authToken = false;
    files = [];

    constructor() {
        super();
        // chrome.identity.getAuthToken({'interactive': true}, (token) => {
        //     gapi.load('client', {
        //         callback: () => {
        //             gapi.client.setToken({access_token: token});
        //             console.log(token);
        //             this.setToken(token);
        //         },
        //         onerror: () => {
        //             // @TODO handle error here properly
        //             alert('gapi.client failed to load!');
        //         },
        //         timeout: 5000, // 5 seconds.
        //         ontimeout: () => {
        //             // @TODO handle error here properly
        //             alert('gapi.client could not load in a timely manner!');
        //         }
        //     });
        // });

        gapi.load('client', {
            callback: () => {
                gapi.client.setToken({access_token: 'ya29.Gl1GB5JWe67oCWtiT4y2pcxEwUvHD5UMUrRES2l0uh4CvL_Nq8IUWiHVOYFo6UdiRHnBIe3hqZVnX3A1DEThZ60okwVut1FM4p6GqZnZZRxypWjpUpUE4qL52gAE5B4'});
                this.setToken('ya29.Gl3dBtGUkm7DWQFNRO4yABz1KRDV8jdho-HXA66fvT8sLEaZ5K2foMmGaPOUD0P3cXfWiUCcEFYjIYGaK154ngKT3uYCpiYvfKumd8YS0rVzlaNly5d9krUmzIXoKac');
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
    }

    setToken(token) {
        this.authToken = token;
    }
}

export default decorate(AuthStore, {
    authToken: observable,
    setToken: action
}).get();

