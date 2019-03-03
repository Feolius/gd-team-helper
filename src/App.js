/* global gapi chrome */
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import MainLayout from './components/MainLayout.js';
import {observer} from 'mobx-react';
import authStore from './stores/Auth.js';

class App extends Component {
    render() {
        let app =
            <div className="loader-screen">
                <span className="glyphicon glyphicon-refresh spinner"></span>
            </div>;
        if (authStore.authToken) {
          app = <MainLayout/>;
        }
        return app;
    }
}

export default observer(App);
