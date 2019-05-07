/* global gapi chrome */
import singleton from 'singleton';

const DEFAULT_REQUEST_TIMEOUT = 1000;
const MAX_REQUESTS_IN_BATCH = 10;

class GapiRequestsPool extends singleton {
    _requestsCounter = 0;
    _requestsQueue = new Map();
    _intervalId = 0;
    _requestsNumber = 0;
    _requestTimeout = DEFAULT_REQUEST_TIMEOUT;
    _batchInProcess = false;
    _increaseTimeout = false;

    request(requestParams) {
        return new Promise((resolve, reject) => {
            this._requestsQueue.set(requestParams, [resolve, reject]);
            if (this._intervalId === 0) {
                this._intervalId = setInterval(() => {
                    this._sendRequestBatch();
                }, this._requestTimeout);
                this._sendRequestBatch();
            }
        });
    }

    _sendRequestBatch() {
        if (this._requestsQueue.size > 0) {
            if (!this._batchInProcess) {
                this._batchInProcess = true;
                let requestsInBatch = 0;
                const batch = gapi.client.newBatch();
                for (const [requestParams, callbacks] of this._requestsQueue.entries()) {
                    const request = gapi.client.request(requestParams);
                    batch.add(request);
                    request.then(response => {
                        this._requestsNumber++;
                        if (response.result !== undefined) {
                            callbacks[0](response.result);
                        }
                    }, response => {
                        if (((response.result || {}).error || {}).errors) {
                            const error = response.result.error.errors[0];
                            console.log(error);
                            if (error.domain !== undefined && error.domain === 'usageLimits') {
                                // if (!this._increaseTimeout) {
                                //     this._increaseTimeout = true;
                                // }
                                this._requestsQueue.set(requestParams, callbacks);
                            } else {
                                callbacks[1](error);
                            }
                        }
                    });
                    this._requestsQueue.delete(requestParams);
                    requestsInBatch++;
                    if (requestsInBatch === MAX_REQUESTS_IN_BATCH) {
                        break;
                    }
                }
                batch.then((responseMap) => {
                    console.log(this._requestsNumber);
                    this._batchInProcess = false;
                    // if (this._increaseTimeout) {
                    //     console.log(responseMap);
                    //     clearInterval(this._intervalId);
                    //     if (this._requestTimeout < 8000) {
                    //         this._requestTimeout *= 2;
                    //     }
                    //
                    //     this._intervalId = setInterval(() => {
                    //         this._sendRequestBatch();
                    //     }, this._requestTimeout);
                    //     this._increaseTimeout = false;
                    // }
                }, (error) => {
                    console.log(error);
                    // console.log(this._requestsNumber);
                });
            }
        } else {
            clearInterval(this._intervalId);
            this._intervalId = 0;
            this._requestTimeout = DEFAULT_REQUEST_TIMEOUT;
        }
    }

    abortRequests() {
        this._requestsQueue = new Map();
        this._requestsCounter = 0;
    }
}

export default GapiRequestsPool.get();
