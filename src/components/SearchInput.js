import React from 'react';

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        if ((event.type === 'keypress' && event.which === 13) || event.type !== 'keypress') {
            this.props.handleSearch(this.state.value);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-6">
                        <div id="custom-search-input">
                            <div id="search-box" className="input-group col-xs-12">
                                <input type="text" className="form-control input-lg" value={this.state.value} onChange={this.handleInput} onKeyPress={this.handleSubmit} placeholder="Email"/>
                                <span className="input-group-btn">
                        <button className="btn btn-info btn-lg" type="button" onClick={this.handleSubmit}>
                            <i className="glyphicon glyphicon-search"></i>
                        </button>
                    </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchInput;
