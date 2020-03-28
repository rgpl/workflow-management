import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './home/home';
import SketchPad from './sketchpad/sketchpad';
import { Provider } from 'mobx-react';
import { journeyStore } from './store/journeyStore';

const stores ={
    journeyStore
};

//window._____APP_STATE_____ = stores;

const App = () =>(

    <Provider {...stores}>
        <Router >
            <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route path="/sketchpad" component={SketchPad}></Route>
            </Switch>
        </Router>
    </Provider>
        
)


export default App;
