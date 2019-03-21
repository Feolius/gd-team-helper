import React from 'react';
import SearchInput from 'components/SearchInput.js';
import FilePath from 'components/FilesPath';
import OwnerActionButtons from 'components/OwnerActionButtons.js'
import FilesGrid from 'components/FilesGrid.js';

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
            <React.Fragment>
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
                            <FilePath/>
                            <FilesGrid/>
                        </div>
                        <div className="col-xs-2 left-sidebar">
                            sidebar right
                        </div>
                    </div>
                </div>
            </React.Fragment>
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


