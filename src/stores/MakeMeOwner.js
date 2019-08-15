import {decorate, observable, reaction, computed, action, runInAction} from 'mobx';
import singleton from "singleton";
import filesStore from "stores/Files.js";
import FilesTreeBuilder from "lib/FilesTreeBuilder.js";
import gapiRequestsPool from "lib/GapiRequestsPool";

class MakeMeOwnerStore extends singleton {
    processing = false;
    treeBuilders = [];

    execute() {
        this.processing = true;

    }

    testCopySingleFile() {
        const fileId = Object.keys(filesStore.filesSelected).pop();
        const file = filesStore.filesSorted.get(fileId);
        gapiRequestsPool.request({
            'method': 'POST',
            'path': `/drive/v3/files/${fileId}/copy`,
            'params': {
            },
            'body': {
                // Keep name exactly the same. This request adds "Copy" prefix to original file names for Native GD files.
                'name': file.name
            }
        }).then(res => {
            console.log(res);
        });
    }

    testRemoveSingleFile() {
        const fileId = Object.keys(filesStore.filesSelected).pop();
        const file = filesStore.filesSorted.get(fileId);
        gapiRequestsPool.request({
            'method': 'PATCH',
            'path': `/drive/v3/files/${fileId}`,
            'params': {
                'removeParents': file.parents
            }
        }).then(res => {
            console.log(res);
        });
    }

    testCopySingleFolder() {
        const fileId = Object.keys(filesStore.filesSelected).pop();
        const file = filesStore.filesSorted.get(fileId);
        console.log({...file});
        // gapiRequestsPool.request({
        //     'method': 'POST',
        //     'path': `/drive/v3/files`,
        //     'params': {},
        //     'body': {
        //         'mimeType': 'application/vnd.google-apps.folder',
        //         'name': file.name,
        //         'parents': file.parents,
        //         // @TODO check how permissions work
        //         'permissionIds': file.permissionIds
        //     }
        // }).then(res => {
        //     console.log(res);
        // });
    }

    testBuildTree() {
        this.processing = true;
        const treeBuilderPromises = [];
        for (const selectedFileId of Object.keys(filesStore.filesSelected)) {
            const file = filesStore.filesSorted.get(selectedFileId);
            const treeBuilder = new FilesTreeBuilder(file);
            this.treeBuilders.push(treeBuilder);
            treeBuilderPromises.push(treeBuilder.buildTree());
        }
        Promise.all(treeBuilderPromises)
            .then(
                (results) => {
                    runInAction(() => {
                        console.log(results);
                        this.processing = false;
                    });
                }
            )
            .catch((error) => {
                runInAction(() => {
                    console.log(error);
                    this.processing = false;
                });
            });
    }

    abortTreeBuilding() {
        for (const treeBuilder of this.treeBuilders) {
            treeBuilder.abort();
        }
        this.treeBuilders = [];
    }
}

export default decorate(MakeMeOwnerStore, {
    processing: observable,
    execute: action,
    testBuildTree: action
}).get();
