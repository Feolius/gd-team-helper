import React from 'react';
import {observer} from 'mobx-react';
import filesStore from 'stores/Files.js';

class FilesGrid extends React.Component{
    constructor(props) {
        super(props);
        this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
        this.allCheckboxRef = React.createRef();
    }

    componentDidUpdate() {
        const filesSelectedNumber = Object.entries(filesStore.filesSelected).length;
        this.allCheckboxRef.current.indeterminate = filesSelectedNumber > 0 && filesSelectedNumber !== filesStore.filesSorted.length;
    }

    handleFileClick(fileId, e) {
        console.log(fileId);
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

    render() {
        const headerRow = (
            <div className="row files-grid-header">
                <div className="col-xs-1">
                    <input id="select-all" type="checkbox" ref={this.allCheckboxRef} disabled={!filesStore.files.length > 0} onChange={this.handleAllCheckboxChange}/>
                </div>
                <div className="col-xs-5">Name</div>
                <div className="col-xs-3">Owner</div>
                <div className="col-xs-3">GD Link</div>
            </div>
        );

        let filesContainer = (
            <div className="files-container">
                <div className="loader-screen">
                    <span className="glyphicon glyphicon-refresh spinner"></span>
                </div>
            </div>
        );
        if (!filesStore.processingRequest) {
            const fileRows = [];
            if (filesStore.files.length > 0) {
                let fileRowClasses;
                for (const file of filesStore.filesSorted) {
                    fileRowClasses = ['row', 'file-row'];
                    if (!!filesStore.filesSelected[file.id]) {
                        fileRowClasses.push('selected');
                    }
                    fileRows.push((<div key={file.id} className={fileRowClasses.join(' ')} onClick={this.handleFileClick.bind(this, file.id)}>
                        <div className="col-xs-1"><input type="checkbox" checked={!!filesStore.filesSelected[file.id]}/></div>
                        <div className="col-xs-5 file-name"><img className="file-icon" src={file.iconLink}/>{file.name}</div>
                        <div className="col-xs-3">{file.owners[0].displayName}</div>
                        <div className="col-xs-3"><a href={file.webViewLink} target="_blank">Open in GD</a></div>
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
