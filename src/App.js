import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import React, { Component } from 'react';
import SearchInput from './components/SearchInput.js';

class App extends Component {
  render() {
    return (
        <SearchInput/>
    );
  }
}

export default App;
