import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import { IntersectingCirclesSpinner } from 'react-epic-spinners'
import empty from '../assets/empty.png'
import { JSXElement } from '@babel/types'

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
    const [data, loading] = useFetch(`${process.env.REACT_APP_BASE_URL}/campgrounds`)
    
    if(loading || (data && !data.campgrounds))
        return <IntersectingCirclesSpinner color="#feca76" className="loading"/>

    const renderCampgrounds = (campgrounds: Array<Campground>, search: string) => {
        let campgroundsJSX: Array<JSX.Element> = []
        for(let camp = 0; camp < campgrounds.length; camp++) {
            if(campgrounds[camp].name.toLowerCase().includes(search))
                campgroundsJSX.push(
                    <div key={campgrounds[camp]._id} className="col-lg-3 col-md-6 col-sm-12">
                        <div className="thumbnail campground-cards">
                            <img className="thumbnail-img" src={campgrounds[camp].image} alt={campgrounds[camp].name}/>
                            <p className="card-p">{campgrounds[camp].name}</p>
                            <p className="card-p">
                                <Link to={`/${campgrounds[camp]._id}`}>Learn More</Link>
                            </p>
                        </div>
                    </div>
                )
        }
        if(campgroundsJSX.length)
            return campgroundsJSX
        else
            return (
                <div className="empty">
                    <img src={empty} alt="no campgrounds available"/>
                </div>
            )
    }
    
    return (
        <div className="container">
            <div className="row">
                {data && renderCampgrounds(data.campgrounds, search)}
            </div>
        </div>
    )
}

export default Campgrounds
