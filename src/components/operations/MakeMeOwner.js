import React from 'react';
import {observer} from "mobx-react-lite";
import {Button, Col, Modal, Row, Spinner} from "react-bootstrap";
import filesStore from 'stores/Files.js';
import makeMeOwnerStore from 'stores/MakeMeOwner.js';

export default observer(() => {
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    return (
        <div className="operation-buttons-wrapper make-me-owner-operation-wrapper">
            <div>This operation will copy selected items into its current folders (if it's possible) and after this
                remove corresponding items.
            </div>
            <Button
                disabled={Object.entries(filesStore.filesSelected).length === 0}
                onClick={() => {makeMeOwnerStore.testBuildTree()}}
            >Make me Owner</Button>
            <Modal show={makeMeOwnerStore.processing} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Please wait</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="preparing-to-copy-modal-body">
                        <Spinner animation="border" variant="primary"/>
                        <span>Building Files Tree. This may take some time.</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {makeMeOwnerStore.abortTreeBuilding()}}>
                        Abort
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});
