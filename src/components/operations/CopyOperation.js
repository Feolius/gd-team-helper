import React from 'react';
import filesStore from 'stores/Files.js';
import filesPathStore from 'stores/FilesPath.js';
import {Row, Col, Spinner, Button, Modal} from "react-bootstrap";
import CopyOperationStore from 'stores/CopyOperation.js';
import {observer} from "mobx-react-lite";

export default observer(() => {
    const [showPrepareToCopyModal, setShowPrepareToCopyModal] = React.useState(false);

    function prepareToCopy() {
        setShowPrepareToCopyModal(false);
        CopyOperationStore.buildTree();
    }

    let buttons =
        (
            <Row>
                <Col className="col-xs-6">
                    <Button variant="primary"
                            block={true}
                            className="btn-copy"
                            onClick={() => setShowPrepareToCopyModal(true)}
                            disabled={Object.entries(filesStore.filesSelected).length === 0}>
                        Copy
                    </Button>
                </Col>
            </Row>);
    if (CopyOperationStore.filesTree) {
        buttons =
            (
                <React.Fragment>
                    <Row>
                        <Col>{CopyOperationStore.filesNumberToCopy} objects are selected to copy</Col>
                    </Row>
                    <Row>
                        <Col classNeame="col-xs-6">
                            <Button variant="success"
                                    block={true}
                                    className="btn-paste"
                                    disabled={!filesPathStore.currentFolder}>
                                Paste
                            </Button>
                        </Col>
                        <Col classNeame="col-xs-6">
                            <Button variant="danger"
                                    block={true}
                                    className="btn-paste"
                                    onClick={() => CopyOperationStore.resetTree()}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </React.Fragment>
            );
    }

    return (
        <div className="operation-buttons-wrapper copy-buttons-wrapper">
            <h4>Copy</h4>
            {buttons}
            <Modal show={showPrepareToCopyModal} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Prepare to Copy</Modal.Title>
                </Modal.Header>
                <Modal.Body>By pressing Prepare to Copy button we will build a files tree containing all files and
                    folders that you are willing to copy. This is needed for supporting folders Copy with all its
                    inner content. Process may take some time depending on overall amount of files inside selected
                    folders.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPrepareToCopyModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => prepareToCopy()}>
                        Prepare to Copy
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={CopyOperationStore.buildingTree} backdrop="static">
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
                    <Button variant="secondary" onClick={() => CopyOperationStore.abortBuildingTree()}>
                        Abort
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});
