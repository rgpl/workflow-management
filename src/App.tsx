import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/home/Home';
import SketchPad from './components/sketchpad/SketchPad';
import {JourneyStoreProvider} from "./store/JourneyStore";
import {BlocksStoreProvider} from "./store/BlocksStore";

function App() {
  return (
    <JourneyStoreProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sketchpad" component={SketchPad} />
          </Switch>
        </Router>
    </JourneyStoreProvider>
  );
}

export default App;
