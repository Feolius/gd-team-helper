import React from 'react';
import SearchInput from 'components/SearchInput.js';
import FilePath from 'components/FilesPath';
import Operations from 'components/Operations'
import FilesGrid from 'components/FilesGrid.js';
import {Container, Row, Col} from "react-bootstrap";

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
                    <Row>
                        <Col xs={6}>
                            <SearchInput handleSearch={this.handleSearch}/>
                        </Col>
                    </Row>
                </div>
                <ErrorsContainer errors={[]}/>
                <Container fluid={true} className="main-container">
                    <Row>
                        <Col xs={2} className="col-xs-2 left-sidebar">
                            <Operations/>
                        </Col>
                        <Col xs={8} className="content">
                            <FilePath/>
                            <FilesGrid/>
                        </Col>
                        <Col xs={2} className="left-sidebar">
                            sidebar right
                        </Col>
                    </Row>
                </Container>
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


