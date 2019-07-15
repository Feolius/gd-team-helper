import FilesListRequestWrapper from 'lib/FilesListRequestWrapper.js';

export default class FilesTreeBuilder {
    _abort = false;

    constructor(file) {
        this.file = file;
    }

    buildTree() {
        const rootFilesTreeNode = new FilesTreeNode();
        rootFilesTreeNode.file = this.file;
        return new Promise((resolve, reject) => {
            if (this.file.mimeType !== 'application/vnd.google-apps.folder') {
                resolve(rootFilesTreeNode);
            } else {
                this._fillFilesTreeChildren(rootFilesTreeNode)
                    .then(() => {
                        if (!this._abort) {
                            resolve(rootFilesTreeNode);
                        } else {
                            reject('Aborted');
                        }
                    });
            }
        });
    }

    _fillFilesTreeChildren(filesTreeNode) {
        return new Promise((resolve, reject) => {
            const filesListRequest = new FilesListRequestWrapper(`"${filesTreeNode.file.id}" in parents`);
            filesListRequest.getFiles().then((files) => {
                let childFilesTreeNode;
                const fillChildrenPromises = [];
                if (!this._abort) {
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
                            resolve();
                        }, () => {
                            reject();
                        });
                } else {
                    resolve();
                }
            }, (error) => {
                reject();
            });
        });
    }

    abort() {
        this._abort = true;
    }
}

class FilesTreeNode {
    file = {};
    children = [];
}
