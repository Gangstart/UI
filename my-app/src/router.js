import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import CollegeRole from './CollegeRole';
import ApplicationManage from './ApplicationManage';
import App from './App';

class RouterApp extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={App}>
                    <Route path="ApplicationManage" component={ApplicationManage}>
                        <Route path="CollegeRole" component={CollegeRole}/>
                    </Route>
                </Route>
            </Router>

        );
    }
}

export default RouterApp;
