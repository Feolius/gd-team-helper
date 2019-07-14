import React from 'react';
import filesPathStore from 'stores/FilesPath.js';
import {observer} from "mobx-react-lite";
import {Button, Col, Row} from "react-bootstrap";
import filesStore from 'stores/Files.js';

export default observer(() => {


    return (
        <div className="operation-buttons-wrapper make-me-owner-operation-wrapper">
            <div>This operation will copy selected items into its current folders (if it's possible) and after this remove corresponding items.</div>
            <Button disabled={Object.entries(filesStore.filesSelected).length === 0}>Make me Owner</Button>
        </div>
    );
});
