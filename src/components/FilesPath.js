import React from 'react';
import {observer} from 'mobx-react';
import filesPathStore from 'stores/FilesPath.js';
import {Button} from "react-bootstrap";

class FilesPath extends React.Component{

    handlePathBtnClick(file) {
        filesPathStore.setActiveFolder(file);
    }

    handleRootBtnClick() {
        filesPathStore.resetToRoot();
    }

    render() {
        const pathButtons = [<Button variant={filesPathStore.filesPath.length > 0 ? 'default' : 'primary'}
                                     key="root"
                                     className="path-element"
                                     onClick={this.handleRootBtnClick.bind(this)}>
            {filesPathStore.name}</Button>];
        let i = 0;
        for (const file of filesPathStore.filesPath) {
            pathButtons.push(<span className="path-delimiter">/</span>);
            pathButtons.push(<Button variant={i === filesPathStore.filesPath.length - 1 ? 'primary' : 'default'}
                                     key={file.id}
                                     className="path-element"
                                     onClick={this.handlePathBtnClick.bind(this, file)}>
                {file.name}</Button>);
            i++;
        }
        return (
            <div className="files-path-wrapper">
                {pathButtons}
            </div>
        );
    }
}

export default observer(FilesPath);
