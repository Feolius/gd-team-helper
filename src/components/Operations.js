import React from 'react';
import FilterByOwner from 'components/operations/FilterByOwner.js';
import MakeMeOwner from "components/operations/MakeMeOwner.js";

export default function Operations(props){
    return (
        <div className="operations-wrapper">
            <h3>Operations available:</h3>
            <div className="operations-buttons-wrapper">
                <FilterByOwner/>
                <MakeMeOwner/>
            </div>
        </div>

    );
}
