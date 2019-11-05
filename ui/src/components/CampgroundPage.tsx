import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useFetch } from "../hooks/useFetch";
import Comments from "./Comments";
import { IntersectingCirclesSpinner } from "react-epic-spinners";
import { ToastProvider, useToasts } from 'react-toast-notifications'

export interface TParams {
    id: string
}

const Campground = ({match, history, location}: RouteComponentProps<TParams>) => {
    
    const [campground, loading] = useFetch('http://localhost:8080/campgrounds/' + match.params.id)
    const [authorized, _loading] = useFetch('http://localhost:8080/authorized/') 

    const { addToast } = useToasts()

    const deleteCampground = (id: string) => {
        fetch(`http://localhost:8080/campgrounds/${id}/delete`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data && data.isLoggedIn === false) {
                addToast(data.message || 'Something went wrong :(', {appearance: 'error', autoDismiss: true})   
                setTimeout(() => {                 
                    history.push({pathname: '/login', state: {from: `/${match.params.id}`}})
                }, 2000);
            }
            else if(data && !data.success) {
                addToast(data.message || 'Something went wrong :(', {appearance: 'error', autoDismiss: true})
            } else {
                addToast(data.message, {appearance: 'success'})
                setTimeout(() => {
                    history.push('/')
                }, 2000);
            }
        })
    }

    if(loading || !campground || _loading || !authorized)
        return <IntersectingCirclesSpinner color="#feca76" className="loading loading-2" />

    return (
        <ToastProvider>
            <div className="container">
                <div className="campground">
                    <div className="actions">
                        <button onClick={() => history.goBack()} className="delete-btn">
                            Back
                        </button>
                        <button onClick={() => deleteCampground(campground._id)} className="delete-btn">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                    <img className="campground-image" src={campground.image} alt={campground.name} />
                    <h1 className="campground-name">{campground.name}</h1>
                    <p>
                        {campground.description} <br/>
                        <small>- {campground.author}</small>
                    </p>
                    {campground.comments && 
                    <Comments
                    comments={campground.comments} 
                    campgroundName={campground.name}
                    match={match}
                    location={location}
                    history={history}
                    />}
                </div>
            </div>
        </ToastProvider>
    )
} 

export default withRouter(Campground)

