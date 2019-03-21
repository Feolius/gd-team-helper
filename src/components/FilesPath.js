import React from 'react';
import {observer} from 'mobx-react';
import filesPathStore from 'stores/FilesPath.js';

class FilesPath extends React.Component{

    handlePathBtnClick(file) {
        filesPathStore.setActiveFolder(file);
    }

    handleRootBtnClick() {
        filesPathStore.resetToRoot();
    }

    render() {
        const pathButtons = [<button type="button"
                                     className="btn btn-default path-element"
                                     onClick={this.handleRootBtnClick.bind(this)}>
            {filesPathStore.name}</button>];
        let i = 0;
        for (const file of filesPathStore.filesPath) {
            pathButtons.push(<span className="path-delimiter">/</span>);
            const classes = ['btn', 'path-element'];
            let disabled = '';
            if (i === filesPathStore.filesPath.length - 1) {
                classes.push('btn-primary');
                disabled = 'disabled';
            } else {
                classes.push('btn-default');
            }
            pathButtons.push(<button type="button"
                                     className={classes.join(' ')}
                                     disabled={disabled}
                                     onClick={this.handlePathBtnClick.bind(this, file)}>
                {file.name}</button>);
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
