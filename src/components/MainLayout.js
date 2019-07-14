import React from 'react';
import SearchInput from 'components/SearchInput.js';
import FilePath from 'components/FilesPath';
import Operations from 'components/Operations'
import FilesGrid from 'components/FilesGrid.js';
import {Container, Row, Col} from "react-bootstrap";

function MainLayout(){

    function handleSearch(event) {
        console.log(event);
    }

    return (
        <React.Fragment>
            {/*<div className="container search-bar-container">*/}
            {/*    <Row>*/}
            {/*        <Col xs={6}>*/}
            {/*            <SearchInput handleSearch={handleSearch}/>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</div>*/}
            <ErrorsContainer errors={[]}/>
            <Container fluid={true} className="main-container">
                <Row className="main-row">
                    <Col xs={2} className="col-xs-2 left-sidebar">
                        <Operations/>
                    </Col>
                    <Col xs={10} className="content">
                        <FilePath/>
                        <FilesGrid/>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
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


