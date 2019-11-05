import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import App from './components/App'
import Campground from './components/CampgroundPage'
import Auth from './components/Auth'
import AddCampground from './components/AddCampground'
import { ToastProvider } from 'react-toast-notifications'

// @todo create username context 
export default () => {

    return (
        <ToastProvider>
            <Router>
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route exact path="/login" component={(props: any) => <Auth purpose='login' {...props}/>}/>
                    <Route exact path="/signup" component={(props: any) => <Auth purpose='signup' {...props}/>}/>
                    <Route exact path="/add" component={(props: any) => <AddCampground {...props}/>}/>
                    <Route exact path="/:id" component={Campground}/>
                </Switch>
            </Router>
        </ToastProvider>
    )
}