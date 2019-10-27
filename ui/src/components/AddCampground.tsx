import React, { useEffect, useReducer } from 'react'
import { RouteComponentProps, Redirect } from 'react-router'
import { useFetch } from '../hooks/useFetch'

const initialState = {
    name: '',
    description: '',
    image: '',
    price: ''
}

const inputReducer = (state = initialState, action: { type: string, field: any }) => {
    switch(action.type) {
        case 'input': 
            return {
                ...state,
                [action.field.name]: action.field.value
            }
        default: 
            return state
    } 
}

const AddCampground = ({}: RouteComponentProps) => {

    let [data, loading] = useFetch('http://localhost:8080/authorized/')
    const [state, dispatch] = useReducer(inputReducer, initialState)

    // @todo: submit campground
    // const handleInput = () => {

    // }

    if(loading && !data) 
        return <div>loading...</div>

    if(data && data.isLoggedIn === false)
        return <Redirect to={{pathname: '/login', state: {from: '/add'}}} />

    return (
        <div className="campground-form">
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name of the campground</label>
                    <input 
                     className="form-control campground-input" 
                     type="text" 
                     name="name" 
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     placeholder="Yosemite"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Describe {state.name || 'Campground'}</label>
                    <textarea 
                     className="form-control campground-input" 
                     name="description" 
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     placeholder="Yosemite"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Campground image</label>
                    <input 
                     className="form-control campground-input" 
                     type="text" 
                     name="image" 
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     placeholder="https://domain.com/image.jpg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input 
                     type="number" className="form-control campground-input"
                     name="price" 
                     onChange={(e) => dispatch({type: 'input', field: e.target})}
                     min="1"
                     max="10000"
                    />
                </div>
                <input className="auth-btn" type="submit" value="Add Campground"/>
            </form>
        </div>
    )
}

export default AddCampground