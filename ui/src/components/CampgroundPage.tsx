import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useFetch } from "../hooks/useFetch";
import Comments from "./Comments";
import { IntersectingCirclesSpinner } from "react-epic-spinners";

export interface TParams {
    id: string
}

const Campground = ({match, history, location}: RouteComponentProps<TParams>) => {
    
    const [campground, loading] = useFetch('http://localhost:8080/campgrounds/' + match.params.id)

    if(loading || !campground)
        return <IntersectingCirclesSpinner color="#feca76" className="loading loading-2" />

    return (
        <div className="container">
            <div className="campground">
                <img className="campground-image" src={campground.image} alt={campground.name} />
                <h1 className="campground-name">{campground.name}</h1>
                <p>
                    {campground.description}
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
    )
} 

export default withRouter(Campground)

