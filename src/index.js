import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import filesStore from './stores/Files.js';


ReactDOM.render(<App filesStore={filesStore} />, document.getElementById('root'));
