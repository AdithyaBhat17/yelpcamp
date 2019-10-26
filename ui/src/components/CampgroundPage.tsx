import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useFetch } from "../hooks/useFetch";
import Comments from "./Comments";

interface TParams {
    id: string
}

const Campground = ({match}: RouteComponentProps<TParams>) => {
    
    const [campground, loading] = useFetch('http://localhost:8080/campgrounds/' + match.params.id)

    if(loading || !campground)
        return <div>loading...</div>

    return (
        <div className="container">
            <div className="campground">
                <img src={campground.image} alt={campground.name} />
                <h1>{campground.name}</h1>
                <p>
                    {campground.description}
                </p>
                {campground.comments && <Comments comments={campground.comments} campgroundName={campground.name}/>}
            </div>
        </div>
    )
} 

export default withRouter(Campground)

