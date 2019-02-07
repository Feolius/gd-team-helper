import React from 'react';

export default function OwnerActionButtons(props) {
    return (
        <div className="owner-action-buttons-wrapper">
            <button type="button" className="btn btn-primary btn-clone" disabled>
                Make me owner
            </button>
            <button type="button" className="btn btn-danger btn-remove" disabled>
                Remove
            </button>
        </div>
    );

}
