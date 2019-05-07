import React from 'react';
import CopyOperation from 'components/operations/CopyOperation.js'
import RemoveOperation from 'components/operations/RemoveOperation.js';

export default function Operations(props){
    return (
        <div className="operations-wrapper">
            <h3>Operations available:</h3>
            <div className="operations-buttons-wrapper">
                <CopyOperation/>
                <RemoveOperation/>
            </div>
        </div>

    );
}
