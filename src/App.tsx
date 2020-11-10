import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/home/Home';
import { JourneyStoreProvider } from "./store/JourneyStore";
import { ChartStoreProvider } from "./store/ChartStore";
import SketchPad from "./components/sketchpad/SketchPad";

function App() {
  return (
    <JourneyStoreProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <ChartStoreProvider>
              <Route path="/sketchpad" component={SketchPad} />
            </ChartStoreProvider>
          </Switch>
        </Router>
    </JourneyStoreProvider>
  );
}

export default App;
