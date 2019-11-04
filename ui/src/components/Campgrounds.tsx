import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import { IntersectingCirclesSpinner } from 'react-epic-spinners'

interface Campground {
    _id: string;
    name: string;
    image: string,
    description: string
}

interface Props {
    search: string
}

const Campgrounds: React.FC<Props> = ({search}) => {
    const [data, loading] = useFetch('http://localhost:8080/campgrounds')
    
    if(loading || (data && !data.campgrounds))
        return <IntersectingCirclesSpinner color="#feca76" className="loading"/>
    
    return (
        <div className="container">
            <div className="row">
                {data && data.campgrounds.map((campground: Campground) => 
                campground.name.toLowerCase().includes(search) && (
                    <div key={campground._id} className="col-lg-3 col-md-6 col-sm-12">
                        <div className="thumbnail campground-cards">
                            <img className="thumbnail-img" src={campground.image} alt={campground.name}/>
                            <p className="card-p">{campground.name}</p>
                            <p className="card-p">
                                <Link to={`/${campground._id}`}>Learn More</Link>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Campgrounds
