import React from 'react';
import {observer} from "mobx-react-lite";
import filesPathStore from 'stores/FilesPath.js';
import {Button} from "react-bootstrap";

export default observer(() => {
    const pathButtons = [<Button variant={filesPathStore.filesPath.length > 0 ? 'default' : 'primary'}
                                 key="root"
                                 className="path-element"
                                 onClick={() => filesPathStore.resetToRoot()}>
        {filesPathStore.name}</Button>];
    let i = 0;
    for (const file of filesPathStore.filesPath) {
        pathButtons.push(<span key={file.id + '-prefix'} className="path-delimiter">/</span>);
        pathButtons.push(<Button variant={i === filesPathStore.filesPath.length - 1 ? 'primary' : 'default'}
                                 key={file.id}
                                 className="path-element"
                                 onClick={() => filesPathStore.setActiveFolder(file)}>
            {file.name}</Button>);
        i++;
    }
    return (
        <div className="files-path-wrapper">
            {pathButtons}
        </div>
    );
});
