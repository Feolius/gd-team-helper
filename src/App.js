/* global gapi chrome */
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import MainLayout from './components/MainLayout.js';
import { observer } from 'mobx-react';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let app =
            <div className="loader-screen">
                <span className="glyphicon glyphicon-refresh spinner"></span>
            </div>;
        if (this.props.filesStore.files.length > 0) {
          app = <MainLayout/>;
        }
        return app;
    }
}

export default observer(App);
