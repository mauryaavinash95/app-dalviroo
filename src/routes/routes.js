import React from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';

import history from './history';

import Main from '../components/Main';
import Header from '../components/Header';
import Login from '../components/Login';
import Signup from '../components/Signup';
import NotFound from '../components/NotFound';

import Home from '../components/Home';
import CreateOrders from '../components/CreateOrders';
import SetPredicted from '../components/SetPredicted';


export const routes = (
    <Router history={history}>
        <Main>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/home" component={Home} />
                <Route path="/createorders" component={CreateOrders} />
                <Route path="/setpredicted" component={SetPredicted} />
                <Route path="*" component={NotFound} />
            </Switch>
        </Main>
    </Router>
)