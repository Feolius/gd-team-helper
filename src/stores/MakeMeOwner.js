import {decorate, observable, reaction, computed, action, runInAction} from 'mobx';
import singleton from 'singleton';
import filesStore from 'stores/Files.js';
import FilesTreeBuilder from 'lib/FilesTreeBuilder.js';

class MakeMeOwnerStore extends singleton {
    processing = false;
    treeBuilders = [];

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
    testBuildTree: action
}).get();
