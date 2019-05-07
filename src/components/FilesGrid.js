import React from 'react';
import {observer} from "mobx-react-lite";
import filesStore from 'stores/Files.js';
import {Row, Col, Spinner} from "react-bootstrap";

export default observer(() => {
    const allCheckBoxRef = React.useRef(null);

    React.useEffect(() => {
        const filesSelectedNumber = Object.entries(filesStore.filesSelected).length;
        allCheckBoxRef.current.indeterminate = filesSelectedNumber > 0 && filesSelectedNumber !== filesStore.filesSorted.size;
    });

    function handleRowClick(fileId) {
        if (!!filesStore.filesSelected[fileId]) {
            filesStore.unselectFile(fileId);
        } else {
            filesStore.selectFile(fileId);
        }
    }

    function handleAllCheckboxChange(e) {
        if (e.target.checked) {
            filesStore.selectAllFiles();
        } else {
            filesStore.unselectAllFiles();
        }
    }

    function handleOpenFolderClick(fileId, e) {
        filesStore.openFolder(fileId);
        e.stopPropagation();
    }

    const headerRow = (
        <Row className="files-grid-header">
            <Col xs={1}>
                <input id="select-all" type="checkbox" ref={allCheckBoxRef}
                       disabled={!filesStore.files.length > 0} onChange={handleAllCheckboxChange}/>
            </Col>
            <Col xs={5}>Name</Col>
            <Col xs={3}>Owner</Col>
            <Col xs={3}>GD Link</Col>
        </Row>
    );

    let filesContainer = (
        <div className="files-container">
            <div className="loader-screen">
                <Spinner animation="border" variant="primary"/>
            </div>
        </div>
    );
    if (!filesStore.processingRequest) {
        const fileRows = [];
        if (filesStore.files.length > 0) {
            let fileRowClasses;
            for (const file of filesStore.filesSorted.values()) {
                fileRowClasses = ['row', 'file-row'];
                if (!!filesStore.filesSelected[file.id]) {
                    fileRowClasses.push('selected');
                }
                fileRows.push((<div key={file.id} className={fileRowClasses.join(' ')}
                                    onClick={(e) => handleRowClick(file.id, e)}>
                    <Col xs={1}>
                        <input type="checkbox" checked={!!filesStore.filesSelected[file.id]}/>
                    </Col>
                    <Col xs={5} className="file-name">
                        <img className="file-icon" src={file.iconLink}/>{file.name}
                        {file.mimeType === 'application/vnd.google-apps.folder' &&
                        <button type="button" className="btn btn-outline-primary open-folder"
                                onClick={(e) => handleOpenFolderClick(file.id, e)}>
                            <img alt="Go inside" src="door-icon.jpg"/>
                        </button>}
                    </Col>
                    <Col xs={3}>{file.owners[0].displayName}</Col>
                    <Col xs={3}><a href={file.webViewLink} rel="noopener noreferrer" target="_blank">Open in GD</a></Col>
                </div>));
            }
        }
        filesContainer = (
            <div className="files-container">
                {fileRows.length > 0 ? fileRows : 'No files available'}
            </div>
        );
    }

    return (
        <div className="files-grid">
            {headerRow}
            {filesContainer}
        </div>
    );
});
