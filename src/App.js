import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './login/login';
import HomeRoute from './home/home-route';
import Home from './home/home';
import SketchPad from './sketchpad/sketchpad';

class App extends React.Component {
    render(){
        return (
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

        );
    }
}

export default App;
