import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './login/login';
import Home from './home/home';
import SketchPad from './sketchpad/sketchpad';


const App = () =>(
        <Router >
            <Switch>
            <Route path="/login" >
                <Login/>
            </Route>
            <Home exact path="/"/>

            <Route path="/sketchpad">
                <SketchPad editMode={false}></SketchPad>
            </Route>

            </Switch>
        </Router>
)


export default App;
