import {decorate, observable, reaction, computed, action, runInAction} from 'mobx';
import singleton from 'singleton';
import files from 'stores/Files.js';
import FilesListRequestWrapper from 'lib/FilesListRequestWrapper.js';
import gapiRequestsPool from "lib/GapiRequestsPool";

class CopyOperationStore extends singleton {
    filesTree = null;
    buildingTree = false;
    copying = false;
    _abortBuildingTree = false;

    buildTree() {
        let file;
        const rootFilesTreeNode = new FilesTreeNode();
        let childrenFilesTreeNode;
        const fillChildrenPromises = [];
        for (const selectedFileId of Object.keys(files.filesSelected)) {
            file = files.filesSorted.get(selectedFileId);
            childrenFilesTreeNode = new FilesTreeNode();
            childrenFilesTreeNode.file = file;
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // If we have at least one folder then we need some time to build tree. Set appropriate flag.
                this.buildingTree = true;
                fillChildrenPromises.push(this._fillFilesTreeChildren(childrenFilesTreeNode));
            }
            rootFilesTreeNode.children.push(childrenFilesTreeNode);
        }
        Promise.all(fillChildrenPromises)
            .then(() => {
                runInAction(() => {
                    this.buildingTree = false;
                    this.filesTree = rootFilesTreeNode;
                    console.log(rootFilesTreeNode);
                });
            }, (error) => {
                runInAction(() => {
                    this.buildingTree = false;
                    this.resetTree();
                    if (error !== 'aborted') {
                        //@TODO need better error logging here
                        console.log(error);
                    }
                });
            })
    }

    _fillFilesTreeChildren(filesTreeNode) {
        return new Promise((resolve, reject) => {
            const filesListRequest = new FilesListRequestWrapper(`"${filesTreeNode.file.id}" in parents`);
            filesListRequest.getFiles().then((files) => {
                let childFilesTreeNode;
                const fillChildrenPromises = [];
                if (this._abortBuildingTree) {
                    reject();
                } else {
                    for (const file of files) {
                        childFilesTreeNode = new FilesTreeNode();
                        childFilesTreeNode.file = file;
                        if (file.mimeType === 'application/vnd.google-apps.folder') {
                            fillChildrenPromises.push(this._fillFilesTreeChildren(childFilesTreeNode));
                        }
                        filesTreeNode.children.push(childFilesTreeNode);
                    }
                    Promise.all(fillChildrenPromises)
                        .then(() => {
                            resolve()
                        }, () => {
                            reject();
                        });
                }
            }, (error) => {
                reject();
            });
        });
    }

    abortBuildingTree() {
        this.buildingTree = false;
        this._abortBuildingTree = true;
        gapiRequestsPool.abortRequests();
    }

    resetTree() {
        this.filesTree = null;
    }

    get filesNumberToCopy() {
        let filesNumber = 0;
        if (this.filesTree) {
            filesNumber = CopyOperationStore._countFilesTreeChildren(this.filesTree);
        }
        return filesNumber;
    }

    static _countFilesTreeChildren(filesTreeNode) {
        let count = 0;
        for (const child of filesTreeNode.children) {
            count += (CopyOperationStore._countFilesTreeChildren(child) + 1);
        }
        return count;
    }
}

class FilesTreeNode {
    file = {};
    children = [];
}

export default decorate(CopyOperationStore, {
    filesTree: observable,
    buildingTree: observable,
    copying: observable,
    buildTree: action,
    abortBuildingTree: action,
    resetTree: action,
    filesNumberToCopy: computed
}).get();
