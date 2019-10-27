import React, { useState } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import App from './components/App'
import Campground from './components/CampgroundPage'
import Auth from './components/Auth'
import AddCampground from './components/AddCampground'

// @todo create username context 
export default () => {

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route exact path="/login" render={(props) => <Auth purpose='login' {...props}/>}/>
                <Route exact path="/signup" render={(props) => <Auth purpose='signup' {...props}/>}/>
                <Route exact path="/add" render={(props) => <AddCampground {...props}/>}/>
                <Route exact path="/:id" component={Campground}/>
            </Switch>
        </Router>
    )
}