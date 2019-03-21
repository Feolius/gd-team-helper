import React from 'react';

class FilesPath extends React.Component{
    render() {
        return (
            <div className="files-path-wrapper">
                <button type="button" className="btn path-element">root</button><span className="path-delimiter">/</span><button type="button" className="btn btn-primary path-element">Test</button><span className="path-delimiter">/</span>
            </div>
        );
    }
}

export default FilesPath;
