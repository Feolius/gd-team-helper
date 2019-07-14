import React from 'react';
import filterByOwnerStore from "stores/FilterByOwner.js";
import {observer} from "mobx-react-lite";
import {Button, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";

const ENTER_KEY_CODE = 13;

export default observer(() => {
    const [inputValue, setInputValue] = React.useState('');

    function filterHandler() {
        filterByOwnerStore.setOwnerValue(inputValue);
    }

    return (
        <div className="operation-buttons-wrapper filter-by-owner-operation-wrapper">
            <h4>Filter by owner</h4>
            <Form.Control type="text" placeholder="Owner email" onChange={event => {
                setInputValue(event.target.value)
            }} value={inputValue} onKeyPress={(event => {
                if (event.which === ENTER_KEY_CODE) {
                    filterHandler();
                }
            })}></Form.Control>
            <Row>
                <Col classNeame="col-xs-6">
                    <Button variant="success"
                            block={true}
                            className="btn-filter"
                            onClick={filterHandler}
                            disabled={filterByOwnerStore.ownerValue !== ''}>
                        Filter
                    </Button>
                </Col>
                <Col classNeame="col-xs-6">
                    <Button variant="danger"
                            block={true}
                            className="btn-reset"
                            onClick={() => {
                                setInputValue('');
                                filterByOwnerStore.setOwnerValue('');
                            }}
                            disabled={filterByOwnerStore.ownerValue === ''}>
                        Reset
                    </Button>
                </Col>
            </Row>
        </div>
    );
});
