/* global gapi chrome */
import {decorate, observable, reaction, computed, action, runInAction} from 'mobx';
import singleton from 'singleton';

const INITIAL_QUERY = 'sharedWithMe = true';

class FilesPath extends singleton {
    filesPath = [];
    rootQuery = this.initialQuery;
    name = 'root';

    constructor() {
        super();
    }

    setActiveFolder(file) {
        // @TODO add check that this is folder and that something was done with actual path. Otherwise throw error.
        if (this.filesPath.length === 0) {
            // If files path is empty then we cannot check anything, just add it.
            this.filesPath.push(file);
        } else {
            // It's a case when we switch back to existing in path folder.
            const filePathFolderIndex = this.filesPath.indexOf(file);
            if (filePathFolderIndex !== -1) {
                this.filesPath.splice(filePathFolderIndex + 1, this.filesPath.length - 1 - filePathFolderIndex);
            } else {
                // It's a case that current file is a child of last path folder.
                const lastFolder = this.filesPath[this.filesPath.length - 1];
                if (file.parents.indexOf(lastFolder.id) !== -1) {
                    this.filesPath.push(file);
                }
            }
        }
    }

    resetToRoot() {
        this.filesPath = [];
    }

    setRootQuery(query) {
        this.rootQuery = query;
        this.filesPath = [];
    }

    get activeQuery() {
        let query = this.rootQuery;
        if (this.filesPath.length > 0) {
            query = `"${this.filesPath[this.filesPath.length - 1].id}" in parents`;
        }
        return query;
    }

    // For export purposes.
    get initialQuery() {
        return INITIAL_QUERY;
    }
}

export default decorate(FilesPath, {
    filesPath: observable,
    rootQuery: observable,
    activeQuery: computed,
    setActiveFolder: action,
    setRootQuery: action,
    resetToRoot: action
}).get();