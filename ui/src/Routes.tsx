import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import App from './components/App'

export default () => {
    return (
        <Router>
            <Switch>
                <Route path="/" component={App}/>
                <Route path="/:id" component={App}/>
            </Switch>
        </Router>
    )
}