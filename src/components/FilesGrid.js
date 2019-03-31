import React from 'react';
import {observer} from 'mobx-react';
import filesStore from 'stores/Files.js';
import {Row, Col, Spinner} from "react-bootstrap";

class FilesGrid extends React.Component {
    constructor(props) {
        super(props);
        this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
        this.allCheckboxRef = React.createRef();
    }

    componentDidUpdate() {
        const filesSelectedNumber = Object.entries(filesStore.filesSelected).length;
        this.allCheckboxRef.current.indeterminate = filesSelectedNumber > 0 && filesSelectedNumber !== filesStore.filesSorted.size;
    }

    handleRowClick(fileId, e) {
        if (!!filesStore.filesSelected[fileId]) {
            filesStore.unselectFile(fileId);
        } else {
            filesStore.selectFile(fileId);
        }
    }

    handleAllCheckboxChange(e) {
        if (e.target.checked) {
            filesStore.selectAllFiles();
        } else {
            filesStore.unselectAllFiles();
        }
    }

    handleOpenFolderClick(fileId, e) {
        filesStore.openFolder(fileId);
        e.stopPropagation();
    }

    render() {
        const headerRow = (
            <Row className="files-grid-header">
                <Col xs={1}>
                    <input id="select-all" type="checkbox" ref={this.allCheckboxRef}
                           disabled={!filesStore.files.length > 0} onChange={this.handleAllCheckboxChange}/>
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
                                        onClick={this.handleRowClick.bind(this, file.id)}>
                        <Col xs={1}>
                            <input type="checkbox" defaultChecked={!!filesStore.filesSelected[file.id]}/>
                        </Col>
                        <Col xs={5} className="file-name">
                            <img className="file-icon" src={file.iconLink}/>{file.name}
                            {file.mimeType === 'application/vnd.google-apps.folder' &&
                            <button type="button" className="btn btn-outline-primary open-folder"
                                    onClick={this.handleOpenFolderClick.bind(this, file.id)}>
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
    }
}

export default observer(FilesGrid);
