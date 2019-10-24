import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import App from './components/App'
import Campground from './components/CampgroundPage'

// const username = React.createContext(undefined)

// @todo create username context 
export default () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/:id" component={Campground}/>
            </Switch>
        </Router>
    )
}