import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';

export default function Operations(props) {
    return (
        <React.Fragment>
            <h3>Operations available:</h3>
            <div className="operations-buttons-wrapper">
                <Row className="operation-buttons-wrapper copy-buttons-wrapper">
                    <h4>Copy</h4>
                    <Col className="col-xs-6">
                        <Button variant="primary" block={true} className="btn-copy">
                            Copy
                        </Button>
                    </Col>

                    {/*<div className="col-xs-6">*/}
                        {/*<button type="button" className="btn btn-success btn-paste btn-block" disabled>*/}
                            {/*Paste*/}
                        {/*</button>*/}
                    {/*</div>*/}
                    {/*<div className="col-xs-6">*/}
                        {/*<button type="button" className="btn btn-danger btn-paste btn-block" disabled>*/}
                            {/*Cancel*/}
                        {/*</button>*/}
                    {/*</div>*/}
                </Row>
                <div className="operation-buttons-wrapper remove-buttons-wrapper">
                    <Button variant="danger" className="btn-paste">Remove</Button>
                </div>
            </div>
        </React.Fragment>

    );

}
