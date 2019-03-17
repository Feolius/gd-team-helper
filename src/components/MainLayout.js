import React from 'react';
import SearchInput from 'components/SearchInput.js';
import OwnerActionButtons from 'components/OwnerActionButtons.js'
import FilesGrid from 'components/FilesGrid.js';

const FILES = [{
    "id": "1rrY67pjg8hoJaSmEZ35ey7bOpvhMtMd64-MDkFpt__g",
    "name": "test",
    "parents": ["1QyXbKouyvOzQDEBl9uuoWdK_5JrjW1Pq"],
    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document",
    "modifiedTime": "2019-02-07T15:49:16.827Z",
    "owners": [{
        "kind": "drive#user",
        "displayName": "Ivan Strygin",
        "me": false,
        "permissionId": "04554610914304727513",
        "emailAddress": "ivan@zgtec.com"
    }]
}, {
    "id": "0B1YBtHrNrxtUUjBsQWpvLWM5NDA",
    "name": "Data structure our",
    "parents": ["1QyXbKouyvOzQDEBl9uuoWdK_5JrjW1Pq"],
    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.jgraph.mxfile.realtime",
    "modifiedTime": "2018-10-22T11:33:05.925Z",
    "owners": [{
        "kind": "drive#user",
        "displayName": "Ivan Strygin",
        "me": false,
        "permissionId": "04554610914304727513",
        "emailAddress": "ivan@zgtec.com"
    }],
    "size": "5112"
}, {
    "id": "0B1YBtHrNrxtUX1d6aExHOXJmeTg",
    "name": "Data structure theirs",
    "parents": ["1QyXbKouyvOzQDEBl9uuoWdK_5JrjW1Pq"],
    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.jgraph.mxfile.realtime",
    "modifiedTime": "2018-10-22T11:32:45.878Z",
    "owners": [{
        "kind": "drive#user",
        "displayName": "Ivan Strygin",
        "me": false,
        "permissionId": "04554610914304727513",
        "emailAddress": "ivan@zgtec.com"
    }],
    "size": "3854"
}];

class MainLayout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            fileIdsChosen: []
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(event) {
        console.log(event);
    }

    render() {
        return (
            <div>
                <div className="container search-bar-container">
                    <div className="row">
                        <div className="col-xs-6">
                            <SearchInput handleSearch={this.handleSearch}/>
                        </div>
                    </div>
                </div>
                <ErrorsContainer errors={[]}/>
                <div className="container-fluid main-container">
                    <div className="row">
                        <div className="col-xs-2 left-sidebar">
                            <OwnerActionButtons/>
                        </div>
                        <div className="col-xs-8 content">
                            <FilesGrid files={FILES}/>
                        </div>
                        <div className="col-xs-2 left-sidebar">
                            sidebar right
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainLayout;

function ErrorsContainer(props) {
    const errors = props.errors;
    let content = null;
    if (errors.length > 0) {
        content = <div className="errors-container alert alert-danger">
            <ul>
                {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
        </div>
    }
    return content;
}


