/* global gapi chrome */
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import MainLayout from 'components/MainLayout.js';
import {observer} from "mobx-react-lite";
import {configure} from 'mobx';
import authStore from 'stores/Auth.js';
import {Spinner} from "react-bootstrap";

configure({enforceActions: 'observed'});

export default observer(() => {
    let app =
        <div className="loader-screen">
            <Spinner animation="border" variant="primary" />
        </div>;
    if (authStore.authToken) {
        app = <MainLayout/>;
    }
    return app;
});
