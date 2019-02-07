import React from 'react';

export default function FilesGrid(props) {
    const headerRow = (
        <div className="row files-grid-header">
            <div className="col-xs-1">
                <input id="select-all" type="checkbox" disabled/>
            </div>
            <div className="col-xs-5">Name</div>
            <div className="col-xs-3">Owner</div>
            <div className="col-xs-3">Changed</div>
        </div>
    );
    const fileRows = [];
    if (props.files.length > 0) {
        for (let file of props.files) {
            fileRows.push((<div key={file.id} className="row file-row">
                <div className="col-xs-1"><img src={file.iconLink}/></div>
                <div className="col-xs-5 file-name">{file.name}</div>
                <div className="col-xs-3">{file.owners[0].displayName}</div>
                <div className="col-xs-3">{file.modifiedTime}</div>
            </div>))
        }
    }
    const filesContainer = (
        <div className="files-container">
            {fileRows.length > 0 ? fileRows : 'No files available'}
        </div>
    );
    return (
        <div className="files-grid">
            {headerRow}
            {filesContainer}
        </div>
    );
}
