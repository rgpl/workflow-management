import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import Login from './login/login';
import Home from './home/home';
import SketchPad from './sketchpad/sketchpad';


const App = ({store}) =>(
    <Provider store={store}>
        <Router >
            <Switch>
            <Route path="/login" render={props => <Login {...props}  />}>

            </Route>
            <Home exact path="/"/>

            <Route path="/sketchpad">
                <SketchPad editMode={false}></SketchPad>
            </Route>

            </Switch>
        </Router>
    </Provider>
)

App.propTypes ={
    store: PropTypes.object.isRequired
}


export default App;
