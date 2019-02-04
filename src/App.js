/* global gapi chrome */
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import SearchInput from './components/SearchInput.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {token: false};
    }

    componentDidMount() {
        gapi.load('client', {
            callback: () => {
                chrome.identity.getAuthToken({'interactive': true}, (token) => {
                    gapi.load('client', {
                        callback: () => {
                            gapi.client.setToken({access_token: token});
                            this.setState({token: token});
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

    render() {
        let app =
            <div className="loader-screen">
                <span className="glyphicon glyphicon-refresh spinner"></span>
            </div>;
        if (this.state.token) {
          app = <SearchInput/>;
        }
        return app;
    }
}

export default App;
