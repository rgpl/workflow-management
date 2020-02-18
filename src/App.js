import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import Login from './login/login';
import HomeRoute from './home/home-route';
import Home from './home/home';
import SketchPad from './sketchpad/sketchpad';

const App = ({store}) =>(
    <Provider store={store}>
        <Router>
            <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <HomeRoute exact path="/">
                <Home />
            </HomeRoute>
            <Route path="/sketchpad">
                <SketchPad></SketchPad>
            </Route>

            </Switch>
        </Router>
    </Provider>
)

App.propTypes ={
    store: PropTypes.object.isRequired
}


export default App;
