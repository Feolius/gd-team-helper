/* global gapi chrome */
import {decorate, observable, reaction, computed, action, runInAction} from 'mobx';
import singleton from 'singleton';
import filterByOwnerStore from "stores/FilterByOwner.js";

const INITIAL_QUERY = 'sharedWithMe = true';

// @TODO this class should be split onto two separate classes to handle queries and paths.
class FilesPath extends singleton {
    filesPath = [];
    rootQuery = this.initialQuery;
    name = 'root';

    constructor() {
        super();
        reaction(() => filterByOwnerStore.ownerValue, (ownerValue) => {
            if (ownerValue !== '') {
                this.setRootQuery(`"${ownerValue}" in owners`);
            } else {
                this.setRootQuery(this.initialQuery);
            }
        });
    }

    setActiveFolder(file) {
        // @TODO add check that this is a folder and that something was done with actual path. Otherwise throw error.
        if (file.mimeType !== 'application/vnd.google-apps.folder') {
            throw new Error('Attempt to add non folder file in path');
        }
        let activeFolderChanged = false;
        if (this.filesPath.length === 0) {
            // If files path is empty then we cannot check anything, just add it.
            this.filesPath.push(file);
            activeFolderChanged = true;
        } else {
            // It's a case when we switch back to existing folder in path.
            const filePathFolderIndex = this.filesPath.indexOf(file);
            if (filePathFolderIndex !== -1) {
                this.filesPath.splice(filePathFolderIndex + 1, this.filesPath.length - 1 - filePathFolderIndex);
                activeFolderChanged = true;
            } else {
                // It's a case that current file is a child of last path folder.
                const lastFolder = this.filesPath[this.filesPath.length - 1];
                if (file.parents.indexOf(lastFolder.id) !== -1) {
                    this.filesPath.push(file);
                    activeFolderChanged = true;
                }
            }
        }
        if (!activeFolderChanged) {
            throw new Error('Active folder was not changed');
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

    get currentFolder() {
        let currentFolder = null;
        if (this.filesPath.length > 0) {
            currentFolder = this.filesPath[this.filesPath.length - 1];
        }
        return currentFolder;
    }
}

export default decorate(FilesPath, {
    filesPath: observable,
    rootQuery: observable,
    activeQuery: computed,
    setActiveFolder: action,
    setRootQuery: action,
    resetToRoot: action,
    currentFolder: computed
}).get();
