import React from 'react';
import filesStore from 'stores/Files.js';
import {Row, Col, Spinner, Button, Modal} from "react-bootstrap";

export default function RemoveOperation() {
    return (
        <div className="operation-buttons-wrapper remove-buttons-wrapper">
            <Button variant="danger" className="btn-paste">Remove</Button>
        </div>
    );
}
