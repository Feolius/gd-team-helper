import React from 'react';

class SearchInput extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-6">
                        <div id="custom-search-input">
                            <div id="search-box" className="input-group col-xs-12">
                                <input type="text" className="form-control input-lg" placeholder="Email"/>
                                <span className="input-group-btn">
                        <button className="btn btn-info btn-lg" type="button">
                            <i className="glyphicon glyphicon-search"></i>
                        </button>
                    </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchInput;
